import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Register from "./register";
import Logo from "./logo";
import Login from "./login";

export default function Welcome() {
    return (
        <div id="welcome-container">
            <div id="welcome">
                <div id="hero">
                    <Logo />
                </div>
                <HashRouter>
                    <div id="register-login">
                        <Route exact path="/" component={Register} />
                        <Route path="/login" component={Login} />
                    </div>
                </HashRouter>
            </div>
            <div id="slogan">
                <h4>|| Create your own Friendship Book |</h4>
                <h4>| Swap ideas & thoughts |</h4>
                <h4>| Connect with the community ||</h4>
            </div>
        </div>
    );
}
