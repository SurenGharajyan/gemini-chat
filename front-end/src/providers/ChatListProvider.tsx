import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatList {
    _id: string;
    label: string;
}

interface ChatListContextProps {
    chatList: ChatList[];
    setChatList: React.Dispatch<React.SetStateAction<ChatList[]>>;
    selectedConversation: ChatList | null;
    setSelectedConversation: React.Dispatch<React.SetStateAction<ChatList | null>>;
}

const ChatListContext = createContext<ChatListContextProps | undefined>(undefined);

export const ChatListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [chatList, setChatList] = useState<ChatList[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<ChatList | null>(null);

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
