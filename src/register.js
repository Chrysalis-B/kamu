import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleInput(e) {
        this[e.target.name] = e.target.value;
    }
    handleSubmit() {
        const { first, last, email, password } = this;
        axios
            .post("/register", {
                first,
                last,
                email,
                password
            })
            .then(resp => {
                if (resp.data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    render() {
        return (
            <div id="register">
                {this.state.error && (
                    <div className="err">Oops something went wrong</div>
                )}
                <h1>Register</h1>
                <input
                    placeholder="first name"
                    type="text"
                    name="first"
                    onChange={this.handleInput}
                />
                <input
                    placeholder="last name"
                    type="text"
                    name="last"
                    onChange={this.handleInput}
                />
                <input
                    placeholder="email"
                    type="email"
                    name="email"
                    onChange={this.handleInput}
                />
                <input
                    placeholder="password"
                    type="password"
                    name="password"
                    onChange={this.handleInput}
                />
                <button onClick={this.handleSubmit}>Register</button>
                <Link to="/login">Click here to Log in!</Link>
            </div>
        );
    }
}
