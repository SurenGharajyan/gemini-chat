import './main.scss';
import React from "react";
import {Chat} from "./components/Chat";
import {ListPanel} from "./components/ListPanel";
import {ChatListProvider} from "./providers/ChatListProvider";

const App: React.FC = () => {
    return <main className='root-main'>
        <ChatListProvider>
            <ListPanel/>
            <Chat/>
        </ChatListProvider>
    </main>
};

export default App;
