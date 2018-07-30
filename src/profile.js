import React from "react";
import { BrowserRouter, Link, Route } from "react-router-dom";
import ProfilePic from "./profilepic";
import SaveBio from "./savebio";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.showBioEdit = this.showBioEdit.bind(this);
        this.setBio = this.setBio.bind(this);
    }
    showBioEdit() {
        this.setState({
            bioEditIsVisible: true
        });
    }
    setBio(bio) {
        this.props.setBio(bio);
        this.setState({
            bioEditIsVisible: false
        });
    }
    render() {
        return (
            <div className="profile-page">
                <h2>
                    {this.props.first} {this.props.last}
                </h2>
                <div className="profile-container">
                    <h3> Edit your profile</h3>
                    <div className="bio-container">
                        <div className="profilepic-container">
                            <ProfilePic
                                url={this.props.profilePic}
                                onClick={this.props.showUploader}
                            />
                        </div>
                        <p>{this.props.bio}</p>
                        <img
                            className="edit-bio-icon"
                            src="/assets/pencil-edit-button.svg"
                            onClick={this.showBioEdit}
                        />
                        {this.state.bioEditIsVisible && (
                            <SaveBio setBio={this.setBio} />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
