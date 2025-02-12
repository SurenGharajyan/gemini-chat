import axios from 'axios';
import {BASE_URL} from '../helper/global';
import {MessageToBot} from "../@types/interfaces/send-message";

const axiosInstance = (sessionId: string) => axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': sessionId
    },
});

export const fetchChatList = async () => {
    try {
        const sessionId = localStorage.getItem('sessionId');
        const response = await axiosInstance(sessionId ?? '').get(`/chatList`, )

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const fetchConversationHistory = async (conversationId: string) => {
    try {
        const sessionId = localStorage.getItem('sessionId');
        const response = await axiosInstance(sessionId ?? '').get(`/chat/${conversationId}`, )
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sendMessageToBot = async (payload: MessageToBot, signal: AbortSignal) => {
    try {
        const response = await axiosInstance(payload.sessionId ?? '').post('/chat', payload, {signal});
        return response.data;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.log('Request was aborted');
        } else {
            throw error;
        }
    }
};
