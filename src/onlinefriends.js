import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class OnlineUsers extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div class="online-container">
                <h2>Users currently online</h2>
                <div className="users-online">
                    {this.props.onlineUsers &&
                        this.props.onlineUsers.map(user => {
                            return (
                                <Link
                                    title={`${user.first} ${user.last}`}
                                    to={`/user/${user.id}`}
                                    key={user.id}
                                >
                                    <div className="online-user">
                                        <img
                                            className="online-photos"
                                            src={
                                                user.img_url ||
                                                "/assets/donut.svg"
                                            }
                                        />
                                    </div>
                                </Link>
                            );
                        })}
                </div>
            </div>
        );
    }
}

const getStateFromRedux = state => {
    return {
        onlineUsers: state.onlineUsers
    };
};

export default connect(getStateFromRedux)(OnlineUsers);
