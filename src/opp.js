import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";

export default class OtherPersonProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.answers = {};
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showInput = this.showInput.bind(this);
        this.getUser = this.getUser.bind(this);
    }
    componentWillReceiveProps(props) {
        this.getUser(props.match.params.id);
        console.log(props.match.params.id);
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        this.getUser(id);
    }
    getUser(id) {
        axios.get(`/user/${id}.json`).then(({ data }) => {
            if (data.redirectToProfile) {
                return this.props.history.push("/");
            }
            if (data.status == 2) {
                this.showInput();
            }
            this.setState({
                first: data.first,
                last: data.last,
                profilePic: data.profilePic,
                id: data.id,
                bio: data.bio,
                questions: data.questions,
                answers: data.answers
            });
            console.log("before", this.state.answers);
        });
    }

    showInput() {
        this.setState({
            inputVisible: true
        });
    }
    handleInput(questionId, answer) {
        this.answers[questionId] = answer;
    }
    handleSubmit(questionId) {
        const id = this.props.match.params.id;
        const answer = this.answers[questionId];
        axios
            .post(`/saveanswer/${id}.json`, { questionId, answer })
            .then(({ data }) => {
                this.setState({
                    answers: this.state.answers.concat(data.answer)
                });
            });
    }
    render() {
        if (!this.state.id) {
            return null;
        }
        if (this.state.questions.length == 0) {
            return (
                <div>
                    <div className="profile-container">
                        <h2 className="opp-name">
                            {this.state.first} {this.state.last}
                        </h2>
                        <FriendButton
                            otherUserId={this.props.match.params.id}
                        />
                        <div className="bio-container">
                            <div className="profilepic-container">
                                <img
                                    src={this.state.profilePic || "donut.svg"}
                                />
                            </div>
                            <p>{this.state.bio || null}</p>
                        </div>
                    </div>
                    <div className="book-container">
                        <h4>
                            This person does not have a book yet! Become Friends
                            and encourage them!
                        </h4>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <div className="profile-container">
                    <h2 className="opp-name">
                        {this.state.first} {this.state.last}
                    </h2>
                    <FriendButton otherUserId={this.props.match.params.id} />
                    <div className="bio-container">
                        <div className="profilepic-container">
                            <img src={this.state.profilePic || "donut.svg"} />
                        </div>
                        <p>{this.state.bio || null}</p>
                    </div>
                </div>
                <div className="book-container">
                    <h3>Book</h3>
                    {!this.state.inputVisible && (
                        <div className="book-become-friends">
                            <h4>Become Friends to fill out the book!</h4>
                            <FriendButton
                                otherUserId={this.props.match.params.id}
                            />
                        </div>
                    )}
                    <div className="your-book">
                        <ol className="questions-list">
                            {this.state.questions &&
                                this.state.questions.map(question => {
                                    return (
                                        <div
                                            className="question"
                                            key={question.id}
                                        >
                                            <li>{question.question}</li>
                                            {this.state.inputVisible && (
                                                <div className="answer">
                                                    <textarea
                                                        ref={elem =>
                                                            (this.elem = elem)
                                                        }
                                                        type="text"
                                                        name="answer"
                                                        onChange={e =>
                                                            this.handleInput(
                                                                question.id,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            this.handleSubmit(
                                                                question.id
                                                            )
                                                        }
                                                        type="button"
                                                        value="submit"
                                                    >
                                                        Submit{" "}
                                                    </button>
                                                </div>
                                            )}
                                            {this.state.answers &&
                                                this.state.answers.map(
                                                    answer => {
                                                        if (
                                                            answer.question_id ==
                                                            question.id
                                                        ) {
                                                            return (
                                                                <p
                                                                    className="answer-p"
                                                                    key={
                                                                        answer.id
                                                                    }
                                                                >
                                                                    {
                                                                        answer.answer
                                                                    }
                                                                </p>
                                                            );
                                                        }
                                                    }
                                                )}
                                        </div>
                                    );
                                })}
                        </ol>
                    </div>
                </div>
            </div>
        );
    }
}
