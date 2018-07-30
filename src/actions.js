import axios from "./axios";

export async function receiveFriendsAndWannabesList() {
    const { data } = await axios.get("/friends.json");
    return {
        type: "RECEIVE_LIST_OF_FRIENDS_AND_WANNABES",
        users: data.users
    };
}

export async function searchUsers(search) {
    const { data } = await axios.get(
        `/users/search?q=${encodeURIComponent(search)}`
    );
    console.log("actions", data);
    return {
        type: "USER_SEARCH",
        userList: data.userResult
    };
}

export async function acceptRequest(id) {
    const { data } = await axios.post(`/acceptfriend/${id}.json`);
    return {
        type: "ACCEPTED_REQUEST",
        newFriend: data.senderId
    };
}

export async function endFriendship(id) {
    const { data } = await axios.post(`/unfriend/${id}.json`);
    return {
        type: "END_FRIENDSHIP",
        status: data.status,
        unfriendedUser: data.unfriendedUser
    };
}

export function onlineUsers(data) {
    return {
        type: "ONLINE_USERS",
        users: data
    };
}

export function userJoined(user) {
    return {
        type: "USER_JOINED",
        newUser: user
    };
}

export function userLeft(user) {
    return {
        type: "USER_LEFT",
        userLeft: user
    };
}

export function getChatMessages(messages) {
    return {
        type: "GET_CHAT_MESSAGES",
        messages: messages
    };
}

export function insertChatMessage(newMessage) {
    return {
        type: "NEW_CHAT_MESSAGE",
        newMessage: newMessage
    };
}
