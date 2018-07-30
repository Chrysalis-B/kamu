import * as io from "socket.io-client";
import {
    onlineUsers,
    userJoined,
    userLeft,
    getChatMessages,
    insertChatMessage
} from "./actions";

let socket;

export function getSocket(store) {
    if (!socket) {
        socket = io.connect();
        socket.on("onlineUsers", users => {
            store.dispatch(onlineUsers(users));
        });

        socket.on("userJoined", user => {
            store.dispatch(userJoined(user));
        });

        socket.on("userLeft", id => {
            store.dispatch(userLeft(id));
        });
        socket.on("chatMessage", newMessage => {
            store.dispatch(insertChatMessage(newMessage));
        });
        socket.on("chatMessages", messages => {
            store.dispatch(getChatMessages(messages));
        });
    }

    return socket;
}

//make a chat componenet that imports this function and then call getSocket() and then socket.emit
//send socket the value of what was entered in the chat field
//make a table for chatmessages with usersid and message plus timestamp or keep an array and push an object to it with users info
