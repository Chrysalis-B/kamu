import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            img: null,
            fileSelected: false
        };
        this.selectFile = this.selectFile.bind(this);
        this.upload = this.upload.bind(this);
    }

    selectFile(e) {
        this.img = e.target.files[0];
        this.setState({
            fileSelected: true
        });
        console.log(this.state);
    }

    upload(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", this.img);
        axios.post("/upload", formData).then(({ data }) => {
            this.props.setImage(data.imgUrl);
        });
    }
    render() {
        return (
            <div className="overlay">
                <div id="upload-profilepic-modal">
                    <p>Edit your profile pic</p>
                    <input
                        onChange={this.selectFile}
                        type="file"
                        name="file"
                        id="file"
                        className="inputfile"
                    />
                    <label htmlFor="file">Choose a file</label>
                    {this.state.fileSelected && (
                        <p style={{ textAlign: "center" }}>file selected</p>
                    )}
                    <div className="uploadbutton-container">
                        <button onClick={this.upload}>Upload Image!</button>
                    </div>
                </div>
            </div>
        );
    }
}
