import React from "react";
import axios from "./axios";

export default class SaveBio extends React.Component {
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
    handleSubmit(e) {
        e.preventDefault();
        const { bio } = this;
        axios.post("/savebio", { bio }).then(({ data }) => {
            this.props.setBio(data.bio);
        });
    }
    render() {
        return (
            <div className="edit-bio">
                {this.state.error && (
                    <div className="err">Oops something went wrong</div>
                )}
                <textarea
                    placeholder="your bio"
                    type="text"
                    name="bio"
                    onChange={this.handleInput}
                />
                <button onClick={this.handleSubmit}>Save</button>
            </div>
        );
    }
}
