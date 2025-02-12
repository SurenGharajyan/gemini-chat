import axios from 'axios';
import {BASE_URL} from "../helper/global";
import React, {useEffect, useState} from 'react';
import {ChatItem, useChatListContext} from "../providers/ChatListProvider";
import {fetchChatList} from "../service/apiService";

export const ListPanel = () => {
    const {selectedConversation, setSelectedConversation, chatList, setChatList} = useChatListContext();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        fetchChatList()
            .then((data: ChatItem[]) => setChatList(data))
    }, []);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleAddNewChat = () => {
        setSelectedConversation(null);
    }

    const handleSelectConversation = (index: number) => {
        const selectedChat = chatList[index];
        setSelectedConversation(selectedChat);
    }

    const handleDeleteChat = (id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        axios.delete(`${BASE_URL}chat/${id}`)
            .then(response => {
                if (response.status === 200) {
                    setChatList(chatList.filter(chat => chat._id !== id));
                    if (selectedConversation?._id === id) {
                        setSelectedConversation(null);
                    }
                } else {
                    console.error('Error deleting chat');
                }
            })
            .catch(error => console.error('Error deleting chat:', error));
    }

    return (
        <div className='panel'>
            {
                chatList.length ?
                    <>
                        <div className='top-content'>
                            <div
                                className='interact-icon'
                                onClick={handleAddNewChat}
                            ></div>
                        </div>
                        <div className="list">
                            <ul>
                                {chatList.map((item: ChatItem, index: number) => (
                                    <li
                                        className={selectedConversation?._id === item._id ? 'selected' : ''}
                                        key={item._id}
                                        onClick={() => handleSelectConversation(index)}
                                    >
                                        <span>{index + 1}.{windowWidth >= 1024 && ' ' + item.label}</span>
                                        <div
                                            className='interact-icon close'
                                            onClick={(event) => handleDeleteChat(item._id, event)}
                                        ></div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                    : <p>No Chat exists</p>
            }
        </div>
    );
};
