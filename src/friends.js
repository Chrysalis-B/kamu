import React from "react";
import { connect } from "react-redux";
import {
    receiveFriendsAndWannabesList,
    acceptRequest,
    endFriendship
} from "./actions";
import { Link } from "react-router-dom";

class Friends extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.dispatch(receiveFriendsAndWannabesList());
    }
    render() {
        return (
            <div id="users">
                <h2>
                    These people want to be friends with you and swap books!
                </h2>
                <div className="pending">
                    {this.props.pending && this.props.pending.length ? (
                        this.props.pending.map(pending => {
                            return (
                                <div className="each-pending" key={pending.id}>
                                    <Link to={`/user/${pending.id}`}>
                                        <div className="profilepic-container-opp">
                                            <img
                                                className="userPhotos"
                                                src={
                                                    pending.img_url ||
                                                    "/assets/donut.svg"
                                                }
                                            />
                                        </div>
                                    </Link>
                                    <p>
                                        {pending.first} {pending.last}
                                    </p>
                                    <div className="friendbutton-container">
                                        <button
                                            onClick={() =>
                                                this.props.dispatch(
                                                    acceptRequest(pending.id)
                                                )
                                            }
                                        >
                                            Accept Request
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="empty-friends-list">
                            {" "}
                            All friend requests accepted!
                        </p>
                    )}
                </div>
                <h2>Your Bookfriends</h2>
                <div className="friends">
                    {this.props.friends && this.props.friends.length ? (
                        this.props.friends.map(friend => {
                            return (
                                <div className="each-friend" key={friend.id}>
                                    <Link to={`/user/${friend.id}`}>
                                        <div className="profilepic-container-opp">
                                            <img
                                                className="userPhotos"
                                                src={
                                                    friend.img_url ||
                                                    "/assets/donut.svg"
                                                }
                                            />
                                        </div>
                                    </Link>
                                    <p>
                                        {friend.first} {friend.last}
                                    </p>
                                    <div className="friendbutton-container">
                                        <button
                                            onClick={() =>
                                                this.props.dispatch(
                                                    endFriendship(friend.id)
                                                )
                                            }
                                        >
                                            End Friendship
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="empty-friends-list">
                            {" "}
                            No friends! Use the chat or search bar to start
                            making magical friendships{" "}
                        </p>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        pending:
            state.users && state.users.filter(friend => friend.status == 1),
        friends: state.users && state.users.filter(friend => friend.status == 2)
    };
};

export default connect(mapStateToProps)(Friends);
