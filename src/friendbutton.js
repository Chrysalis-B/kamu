import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getButtonText = this.getButtonText.bind(this);
        this.makeFriendRequest = this.makeFriendRequest.bind(this);
        this.cancelFriendRequest = this.cancelFriendRequest.bind(this);
        this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
        this.endFriendship = this.endFriendship.bind(this);
    }
    makeFriendRequest() {
        const otherUserId = this.props.otherUserId;
        axios.post(`/addfriend/${otherUserId}.json`).then(({ data }) => {
            this.setState({
                status: data.status,
                recipientId: data.recipientId,
                senderId: data.senderId
            });
        });
    }
    cancelFriendRequest() {
        const otherUserId = this.props.otherUserId;
        axios.post(`/cancelrequest/${otherUserId}.json`).then(({ data }) => {
            this.setState({
                status: data.status,
                recipientId: data.recipientId,
                senderId: data.senderId
            });
        });
    }
    acceptFriendRequest() {
        const otherUserId = this.props.otherUserId;
        axios.post(`/acceptfriend/${otherUserId}.json`).then(({ data }) => {
            this.setState({
                status: data.status,
                recipientId: data.recipientId,
                senderId: data.senderId
            });
        });
    }
    endFriendship() {
        const otherUserId = this.props.otherUserId;
        axios.post(`/unfriend/${otherUserId}.json`).then(({ data }) => {
            this.setState({
                status: data.status,
                recipientId: data.recipientId,
                senderId: data.senderId
            });
        });
    }
    getButtonText() {
        const { status, recipientId, senderId } = this.state;
        if (status == "noStatus") {
            return <button onClick={this.makeFriendRequest}>Add Friend</button>;
        }
        if (status == 1) {
            if (recipientId == this.props.otherUserId) {
                return (
                    <button onClick={this.cancelFriendRequest}>
                        Cancel Friend Request
                    </button>
                );
            } else {
                return (
                    <button onClick={this.acceptFriendRequest}>
                        Accept Friend Request
                    </button>
                );
            }
        }
        if (status == 2) {
            return <button onClick={this.endFriendship}>End Friendship</button>;
        }
    }
    componentDidMount() {
        const otherUserId = this.props.otherUserId;
        axios.get(`/status/${otherUserId}.json`).then(({ data }) => {
            this.setState({
                status: data.status,
                recipientId: data.recipientId,
                senderId: data.senderId
            });
        });
    }
    render() {
        return (
            <div className="friendbutton-container">{this.getButtonText()}</div>
        );
    }
}
