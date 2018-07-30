import React, { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }
    onChange(e) {
        this[e.target.name] = e.target.value;
    }
    onClick(e) {
        e.preventDefault();
        const { email, password } = this;
        axios.post("/login", { email, password }).then(resp => {
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
            <div id="login">
                <h1>Login</h1>

                <input
                    onChange={this.onChange}
                    name="email"
                    placeholder="email"
                    type="email"
                />
                <input
                    onChange={this.onChange}
                    name="password"
                    placeholder="password"
                    type="password"
                />
                <button onClick={this.onClick}>Login</button>
                <Link to="/">Click here to Register!</Link>
            </div>
        );
    }
}
