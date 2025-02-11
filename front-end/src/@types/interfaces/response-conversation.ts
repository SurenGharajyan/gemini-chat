import {ConversationModel} from "./conversation-model";

export interface ResponseConversation {
    _id: string,
    label: string,
    conversationHistory: ConversationModel[]
}
