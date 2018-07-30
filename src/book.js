import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Book extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getPage = this.getPage.bind(this);
    }
    componentDidMount() {
        axios.get("/bookfriends.json").then(({ data }) => {
            this.setState({
                bookFriends: data.data
            });
            console.log(data.data);
        });
    }
    getPage(friendId) {
        axios.get(`/getpage/${friendId}.json`).then(({ data }) => {
            this.setState({
                page: data.data
            });
            console.log(this.state);
        });
    }
    render() {
        return (
            <div className="book-container">
                <div className="book-friends">
                    {this.state.bookFriends && this.state.bookFriends.length ? (
                        this.state.bookFriends.map(friend => {
                            return (
                                <div
                                    className="each-friend"
                                    key={friend.id}
                                    onClick={() => this.getPage(friend.id)}
                                >
                                    <div className="profilepic-container-opp">
                                        <img
                                            className="userPhotos"
                                            src={
                                                friend.img_url ||
                                                "/assets/donut.svg"
                                            }
                                        />
                                    </div>
                                    <p>
                                        {friend.first} {friend.last}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <p className="no-book-friends">
                            {" "}
                            It is empty here! Use the chat to connect with
                            people to fill out your book
                        </p>
                    )}
                </div>
                <div className="page">
                    {this.state.page &&
                        this.state.page.map(qa => {
                            return (
                                <div className="qa" key={qa.id}>
                                    <p>{qa.question}</p>
                                    <p className="answer-p">{qa.answer}</p>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }
}
//in render need list of friends and on click show book below
