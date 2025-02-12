import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatItem {
    _id: string;
    label: string;
}

interface ChatListContextProps {
    chatList: ChatItem[];
    setChatList: React.Dispatch<React.SetStateAction<ChatItem[]>>;
    selectedConversation: ChatItem | null;
    setSelectedConversation: React.Dispatch<React.SetStateAction<ChatItem | null>>;
}

const ChatListContext = createContext<ChatListContextProps | undefined>(undefined);

export const ChatListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [chatList, setChatList] = useState<ChatItem[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<ChatItem | null>(null);

    return (
        <ChatListContext.Provider value={{ chatList, setChatList, selectedConversation, setSelectedConversation }}>
            {children}
        </ChatListContext.Provider>
    );
};

export const useChatListContext = () => {
    const context = useContext(ChatListContext);
    if (!context) {
        throw new Error('useChatListContext must be used within a ChatListProvider');
    }
    return context;
};
