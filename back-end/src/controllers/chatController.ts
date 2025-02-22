import { Request, Response } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Conversation from '../models/Conversation';
import crypto from 'crypto';

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    console.error("GEMINI_API_KEY environment variable is not set");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getChatList = async (req: Request, res: Response) => {
    const id = req.body.id;
    const sessionId = req.headers['x-session-id'];
    if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
    }

    try {
        const conversations = await Conversation.find({ sessionId, id }, 'label value');
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the chat list' });
    }
};

export const createChat = async (req: Request, res: Response) => {
    const { prompt: userMessage, id, sessionId } = req.body;

    if (!userMessage) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    let conversation;

    if (id) {
        conversation = await Conversation.findById(id);
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }
    } else {
        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }

        const chatId = crypto.randomBytes(16).toString("hex");
        conversation = new Conversation({
            label: userMessage,
            conversationHistory: [],
            sessionId,
        });
    }

    conversation.conversationHistory.push({ role: "user", content: userMessage });

    let prompt = "";
    for (const message of conversation.conversationHistory) {
        prompt += `${message.role.toUpperCase()}: ${message.content}\n`;
    }
    prompt += "MODEL:";

    try {
        const result = await model.generateContent(prompt);
        let textResponse = result.response.text();

        if (textResponse) {
            conversation.conversationHistory.push({ role: "model", content: textResponse });
            await conversation.save();
            const aiMessage = processGeneratedContent(textResponse);
            res.json({ _id: conversation._id, label: conversation.label, aiMessage });
        } else {
            res.status(500).json({ error: "No response from the model" });
        }

    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).json({ error: "An error occurred" });
    }
};

export const getChat = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Chat ID is required" });
        }

        const conversation = await Conversation.findById(id);

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        res.json(conversation);
    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteChat = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Conversation.findByIdAndDelete(id);
        res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the chat' });
    }
};

function processGeneratedContent(text: string): string {
    if (text.includes("<") && text.includes(">")) {
        return text;
    }

    const equationRegex = /(\$\$[^\$]+\$\$)|(\$[^\$]+\$)/g;
    text = text.replace(equationRegex, (match) => {
        return match;
    });

    return text;
}
