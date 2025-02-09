import mongoose, { Schema, Document } from 'mongoose';

interface IConversation extends Document {
    label: string;
    conversationHistory: { role: "user" | "model"; content: string }[];
}

const ConversationSchema: Schema = new Schema({
    label: { type: String, required: true },
    conversationHistory: [
        {
            role: { type: String, required: true },
            content: { type: String, required: true }
        }
    ]
});

const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;
