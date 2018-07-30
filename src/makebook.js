import React from "react";
import axios from "./axios";

export default class MakeBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidUpdate() {
        this.tex.value = "";
    }
    handleInput(e) {
        this[e.target.name] = e.target.value;
    }
    handleSubmit(e) {
        e.preventDefault();
        const { question } = this;
        axios
            .post("/savequestion.json", {
                question
            })
            .then(({ data }) => {
                console.log(data);
                this.props.setQuestion(data.question);
            });
    }
    render() {
        if (this.props.questions.length == 0) {
            return (
                <div className="make-book-container">
                    <h3>Edit your book</h3>
                    <div className="make-book">
                        <p>Add a question to your book here</p>
                        <form onSubmit={this.handleSubmit}>
                            <textarea
                                ref={tex => (this.tex = tex)}
                                type="text"
                                name="question"
                                onChange={this.handleInput}
                            />
                            <button type="submit" value="submit">
                                Submit{" "}
                            </button>
                        </form>
                    </div>
                </div>
            );
        }
        return (
            <div className="make-book-container">
                <h3>Edit your book</h3>
                <div className="your-book">
                    <ol className="questions-list">
                        {this.props.questions &&
                            this.props.questions.map(question => {
                                return (
                                    <div className="question" key={question.id}>
                                        <li>{question.question}</li>
                                    </div>
                                );
                            })}
                    </ol>
                </div>

                <div className="make-book">
                    <p>Add a question to your book here</p>
                    <form onSubmit={this.handleSubmit}>
                        <textarea
                            ref={tex => (this.tex = tex)}
                            type="text"
                            name="question"
                            onChange={this.handleInput}
                        />
                        <button type="submit" value="submit">
                            Submit{" "}
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}
