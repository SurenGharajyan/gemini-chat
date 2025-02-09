import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {ChatList, useChatListContext} from "../providers/ChatListProvider";
import {BASE_URL} from "../helper/global";

export const ListPanel = () => {
    const {selectedConversation, setSelectedConversation, chatList, setChatList} = useChatListContext();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        axios.get(`${BASE_URL}chatList`)
            .then(response => setChatList(response.data))
            .catch(error => console.error('Error fetching chat list:', error));
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
                            <i
                                className='fa fa-plus'
                                onClick={handleAddNewChat}
                            ></i>
                        </div>
                        <div className="list">
                            <ul>
                                {chatList.map((item: ChatList, index: number) => (
                                    <li
                                        className={selectedConversation?._id === item._id ? 'selected' : ''}
                                        key={item._id + index}
                                        onClick={() => handleSelectConversation(index)}
                                    >
                                        <span>{index + 1}.{windowWidth >= 768 && ' ' + item.label}</span>
                                        <i
                                            className='fa fa-close'
                                            onClick={(event) => handleDeleteChat(item._id, event)}
                                        ></i>
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
