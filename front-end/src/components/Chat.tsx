import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { letterInitCalc, scrollToBottom, formatMessageContent } from "../helper/utils";
import { capitalizeFirstLetter } from "../helper/text-manipulation-tool";
import { useChatListContext } from "../providers/ChatListProvider";
import { BASE_URL } from "../helper/global";

export const Chat = () => {
    const { chatList, setChatList, selectedConversation, setSelectedConversation } = useChatListContext();
    const [messageCount, setMessageCount] = useState(0);
    const [isLoadingResponse, setLoadingResponse] = useState<boolean>(false);
    const stopTypingRef = useRef<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputFieldRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedConversation) {
            if (!isLoadingResponse) {
                axios.get(`${BASE_URL}chat/${selectedConversation._id}`)
                    .then(response => {
                        const data = response.data;
                        if (chatContainerRef.current) {
                            const formattedContent = data.conversationHistory.map((message: {
                                role: string,
                                content: string
                            }) => `
                                <div class="message ${message.role}">
                                    <div class="msg-header">${capitalizeFirstLetter(message.role === 'model' ? 'Gemini' : 'Talker')}</div>
                                    <div class="msg-body">${formatMessageContent(message.content)}</div>
                                </div>
                            `).join('');

                            chatContainerRef.current.innerHTML = formattedContent;
                            inputFieldRef.current?.focus();
                            scrollToBottom(chatContainerRef.current);
                        }
                    })
                    .catch(error => console.error('Error fetching conversation:', error));
            }
        } else {
            setLoadingResponse(false);
            if (chatContainerRef.current) {
                chatContainerRef.current.innerHTML = '';
            }
            inputFieldRef.current?.focus();
        }
    }, [selectedConversation]);

    const appendMessage = (
        sender: string,
        message: string,
        id: string | null = null
    ) => {
        const messageHtml = `
            <div class="message ${sender}">
                <div class="msg-header">${capitalizeFirstLetter(sender === 'model' ? 'Gemini' : 'Talker')}</div>
                <div class="msg-body" ${id ? `id="${id}"` : ""}>${message}</div>
            </div>
        `;
        if (chatContainerRef.current) {
            chatContainerRef.current.insertAdjacentHTML('beforeend', messageHtml);
        }
    };

    const sendOrStopMessage = () => {
        isLoadingResponse ? stopMessage() : sendMessage();
    };

    const stopMessage = () => {
        stopTypingRef.current = true;
        setLoadingResponse(false);
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
        setLoadingResponse(true);
        stopTypingRef.current = false;
        fetchBotResponse(payload);
    };

    const fetchBotResponse = (payload: { prompt: string }) => {
        axios.post(`${BASE_URL}chat`, payload, {
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((response) => {
                return displayBotResponse(response.data);
            })
            .catch((error: any) => {
                setLoadingResponse(false);
                return displayError();
            });
    };

    const displayBotResponse = (data: { id: string, label: string, aiMessage: string }) => {
        const botMessageId = `botMessage-${messageCount}`;
        setMessageCount(messageCount + 1);
        appendMessage("model", "", botMessageId);

        if (!selectedConversation) {
            const conversation = { label: data.label, _id: data.id };
            setSelectedConversation(conversation);
            setChatList([...chatList, conversation]);
        }

        const botMessageDiv = document.getElementById(botMessageId);
        letterInitCalc(
            data.aiMessage,
            botMessageDiv,
            chatContainerRef as React.RefObject<HTMLElement>,
            () => setLoadingResponse(false),
            stopTypingRef
        );
    };

    const displayError = () => {
        appendMessage("model error", "Failed to fetch a response from the server.");
    };

    return (
        <div className="chat-container-wrapper">
            <header className="header">
                <img
                    src="https://i.ibb.co/F57MGN0/ai-1.png"
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
                    ref={inputFieldRef}
                    type="text"
                    autoFocus={true}
                    placeholder="Ask me anything"
                    autoComplete="off"
                    required
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            sendMessage();
                        }
                    }}
                />
                <button onClick={sendOrStopMessage}>
                    <i className={`fas ${isLoadingResponse ? 'fa-stop' : 'fa-location-arrow'} `}></i>
                </button>
            </footer>
        </div>
    );
};
