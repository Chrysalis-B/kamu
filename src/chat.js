import React from "react";
import { connect } from "react-redux";
import { getSocket } from "./socket";
import { Link } from "react-router-dom";
import OnlineFriends from "./onlinefriends";

class Chat extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidUpdate() {
        this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
        this.tex.value = "";
    }
    render() {
        return (
            <div ref={elem => (this.elem = elem)}>
                <OnlineFriends />
                <div id="chat-container">
                    {this.props.chatMessages &&
                        this.props.chatMessages.map(msg => {
                            return (
                                <div
                                    className="chat-message-container"
                                    key={msg.id}
                                >
                                    <Link to={`/user/${msg.user_id}`}>
                                        <img
                                            className="chatAvatar"
                                            src={
                                                msg.img_url ||
                                                "/assets/donut.svg"
                                            }
                                        />
                                    </Link>
                                    <span>{msg.content}</span>
                                    <p>
                                        {msg.first} {msg.last}
                                    </p>
                                    <p className="chat-date">
                                        {new Date(
                                            msg.created_at
                                        ).toLocaleDateString()}{" "}
                                        at{" "}
                                        {new Date(
                                            msg.created_at
                                        ).toLocaleTimeString()}
                                    </p>
                                </div>
                            );
                        })}
                    <textarea
                        ref={tex => (this.tex = tex)}
                        name="textarea"
                        placholder="type here"
                        onChange={e => (this[e.target.name] = e.target.value)}
                    />
                    <button
                        onClick={() => {
                            getSocket().emit("chatMessage", this.textarea);
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        );
    }
}

const getStateFromRedux = state => {
    return {
        chatMessages: state.chatMessages
    };
};

export default connect(getStateFromRedux)(Chat);

// // var d = console.log (new Date(pass the date you get back from db here as a string));
// //
// console.log(d.toLocaleDateString(), d.toLocaleTimeString());
// //
// // console.log(d.getDate(), d.getMonth(), d.getHours(), d.getDay())
//
