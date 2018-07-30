import React from "react";
import axios from "./axios";
import Logo from "./logo";
import Search from "./search";
import Uploader from "./uploader";
import Profile from "./profile";
import MakeBook from "./makebook";
import OtherPersonProfile from "./opp";
import Friends from "./friends";
import Book from "./book";
import OnlineFriends from "./onlinefriends";
import Chat from "./chat";
import { BrowserRouter, Link, Route } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setBio = this.setBio.bind(this);
        this.setQuestion = this.setQuestion.bind(this);
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            this.setState({
                first: data.first,
                last: data.last,
                profilePic: data.profilePic,
                id: data.id,
                bio: data.bio,
                questions: data.questions
            });
            console.log(this.state.questions);
        });
    }
    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }
    setImage(imgUrl) {
        this.setState({
            profilePic: imgUrl,
            uploaderIsVisible: false
        });
    }
    setBio(newBio) {
        this.setState({
            bio: newBio,
            bioEditIsVisible: false
        });
    }
    setQuestion(question) {
        this.setState({
            questions: this.state.questions.concat(question)
        });
    }

    render() {
        if (!this.state.id) {
            return (
                <div>
                    <p>Loading...</p>
                </div>
            );
        }
        return (
            <BrowserRouter>
                <div id="app">
                    {this.state.uploaderIsVisible && (
                        <Uploader setImage={this.setImage} />
                    )}
                    <div id="nav">
                        <a href="/">
                            <img
                                className="avatar"
                                src={this.state.profilePic}
                            />
                        </a>

                        <ul className="nav-links">
                            <li>
                                <Search />
                            </li>
                            <li>
                                <a href="/friends">My Friends</a>
                            </li>
                            <li>
                                <a href="/mybook">My Book</a>
                            </li>
                            <li>
                                <a href="/chat">Chat</a>
                            </li>
                        </ul>

                        <div id="logo-container">
                            <a title="Logout" href="/logout">
                                &#x1F984;
                            </a>
                        </div>
                    </div>
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                id={this.state.id}
                                first={this.state.first}
                                last={this.state.last}
                                profilePic={this.state.profilePic}
                                showUploader={this.showUploader}
                                bio={this.state.bio}
                                setBio={this.setBio}
                            />
                        )}
                    />

                    <div />

                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <MakeBook
                                    questions={this.state.questions}
                                    setQuestion={this.setQuestion}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/user/:id"
                            component={OtherPersonProfile}
                        />
                        <Route exact path="/friends" component={Friends} />
                        <Route exact path="/mybook" component={Book} />
                        <Route
                            path="/onlinefriends"
                            component={OnlineFriends}
                        />
                        <Route path="/chat" component={Chat} />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

//<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
