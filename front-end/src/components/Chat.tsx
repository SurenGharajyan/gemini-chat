import React, {useEffect, useRef, useState} from 'react';
import {formatMessageContent, letterInitCalc, scrollToBottom} from "../helper/utils";
import {capitalizeFirstLetter} from "../helper/text-manipulation-tool";
import {useChatListContext} from "../providers/ChatListProvider";
import {fetchConversationHistory, sendMessageToBot} from "../service/apiService";
import {ConversationModel} from "../@types/interfaces/conversation-model";
import {MessageToBot} from "../@types/interfaces/send-message";
import {ResponseConversation} from "../@types/interfaces/response-conversation";
import {BotAnswer} from "../@types/interfaces/bot-answer";

export const Chat = () => {
    const {chatList, setChatList, selectedConversation, setSelectedConversation} = useChatListContext();
    const [messageCount, setMessageCount] = useState(0);
    const [isLoadingResponse, setIsLoadingResponse] = useState<boolean>(false);
    const stopTypingRef = useRef<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputFieldRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (selectedConversation) {
            if (!isLoadingResponse) {
                fetchConversationHistory(selectedConversation._id)
                    .then((data: ResponseConversation) => fillPreviousConversation(data))
                    .catch(error => console.error('Error fetching conversation:', error));
            }
        } else {
            resetChat();
        }
    }, [selectedConversation]);

    const resetChat = () => {
        setIsLoadingResponse(false);
        if (chatContainerRef.current) {
            chatContainerRef.current.innerHTML = '';
        }
        inputFieldRef.current?.focus();
    };

    const fillPreviousConversation = (data: { conversationHistory: ConversationModel[] }) => {
        if (chatContainerRef.current) {
            chatContainerRef.current.innerHTML = data.conversationHistory
                .map((message: ConversationModel) => addMessageHtml(message.role, message.content))
                .join('');
            inputFieldRef.current?.focus();
            scrollToBottom(chatContainerRef.current);
        }
    }

    const addMessageHtml = (sender: string, text: string, id?: string | null) => {
        return `
            <div class="message ${sender}">
                 <div class="msg-header">${capitalizeFirstLetter(sender === 'model' ? 'Gemini' : 'Talker')}</div>
                 <div class="msg-body" ${id ? `id="${id}"` : ""}>${formatMessageContent(text)}</div>
            </div>
        `
    }

    const appendMessage = (
        sender: string,
        message: string,
        id: string | null = null
    ) => {
        const messageHtml = addMessageHtml(sender, message, id);
        if (chatContainerRef.current) {
            chatContainerRef.current.insertAdjacentHTML('beforeend', messageHtml);
        }
    };

    const sendOrStopMessage = () => {
        isLoadingResponse ? stopMessage() : sendMessage();
    };

    const stopMessage = () => {
        stopTypingRef.current = true;
        setIsLoadingResponse(false);
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    const sendMessage = () => {
        if (!inputFieldRef.current || isLoadingResponse) return;
        const rawText = inputFieldRef.current.value;

        if (!rawText) return;

        appendMessage("user", rawText);
        scrollToBottom(chatContainerRef.current as HTMLElement);
        inputFieldRef.current.value = "";

        const payload = {
            prompt: rawText,
            id: selectedConversation?._id ?? null
        };
        setIsLoadingResponse(true);
        stopTypingRef.current = false;
        abortControllerRef.current = new AbortController();
        fetchBotResponse(payload, abortControllerRef.current.signal);
    };

    const fetchBotResponse = (payload: MessageToBot, signal: AbortSignal) => {
        sendMessageToBot(payload, signal)
            .then((answer: BotAnswer) => displayBotResponse(answer))
            .catch(() => {
                setIsLoadingResponse(false);
                return displayError();
            });
    };

    const displayBotResponse = (data: BotAnswer) => {
        const botMessageId = `botMessage-${messageCount}`;
        setMessageCount(messageCount + 1);
        appendMessage("model", "", botMessageId);

        if (!selectedConversation) {
            const conversation = {label: data.label, _id: data.id};
            setSelectedConversation(conversation);
            setChatList([...chatList, conversation]);
        }

        const botMessageDiv = document.getElementById(botMessageId);
        letterInitCalc(
            data.aiMessage,
            botMessageDiv,
            chatContainerRef as React.RefObject<HTMLElement>,
            () => setIsLoadingResponse(false),
            stopTypingRef
        );
    };

    const displayError = () => {
        appendMessage("model error", "Failed to fetch a response from the server.");
    };

    const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    }

    return (
        <div className="chat-wrapper">
            <header className="header">
                <img
                    src="/gemini-ai-icon.webp"
                    alt="Chatbot Logo"
                />
            </header>
            <div className="chat-container">
                <main
                    ref={chatContainerRef}
                    className="chat-content"
                ></main>
            </div>
            <footer className="footer">
                <input
                    required
                    type="text"
                    autoFocus={true}
                    ref={inputFieldRef}
                    autoComplete="off"
                    placeholder="Ask me anything"
                    onKeyDown={handleEnterKeyDown}
                />
                <button onClick={sendOrStopMessage}>
                    <div className={`action-icon ${isLoadingResponse ? 'stop' : 'send'}`}></div>
                </button>
            </footer>
        </div>
    );
};
