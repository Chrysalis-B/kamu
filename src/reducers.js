export default function(state = {}, action) {
    if (action.type == "USER_SEARCH") {
        let box = document.querySelector(".search-results");
        if (action.userList == []) {
            box.style.display = "none";
        } else {
            box.style.display = "block";
        }
        if (action.userList.length > 10) {
            box.style.display = "none";
        } else {
            box.style.display = "block";
        }
        state = Object.assign({}, state, {
            searchResults: action.userList
        });
    }
    if (action.type == "RECEIVE_LIST_OF_FRIENDS_AND_WANNABES") {
        state = Object.assign({}, state, {
            users: action.users
        });
    }
    if (action.type == "ACCEPTED_REQUEST") {
        const updatedFriends = state.users.map(friend => {
            if (friend.id == action.newFriend) {
                friend.status = 2;
            }
            return friend;
        });
        state = Object.assign({}, state, {
            users: updatedFriends
        });
        console.log("accepted", state.users);
    }
    if (action.type == "END_FRIENDSHIP") {
        const updatedFriends = state.users.map(friend => {
            if (friend.id == action.unfriendedUser) {
                friend.status = "noStatus";
            }
            return friend;
        });
        console.log(updatedFriends);
        state = Object.assign({}, state, {
            users: updatedFriends
        });
    }
    if (action.type == "ONLINE_USERS") {
        state = Object.assign({}, state, {
            onlineUsers: action.users
        });
    }

    if (action.type == "USER_JOINED") {
        state = Object.assign({}, state, {
            onlineUsers: state.onlineUsers.concat(action.newUser)
        });
    }

    if (action.type == "USER_LEFT") {
        state = Object.assign({}, state, {
            onlineUsers: state.onlineUsers.filter(
                user => user.id != action.userLeft
            )
        });
    }
    if (action.type == "GET_CHAT_MESSAGES") {
        state = Object.assign({}, state, {
            chatMessages: action.messages
        });
    }
    if (action.type == "NEW_CHAT_MESSAGE") {
        state = Object.assign({}, state, {
            chatMessages: state.chatMessages.concat(action.newMessage)
        });
    }
    return state;
}
