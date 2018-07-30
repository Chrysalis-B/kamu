import React from "react";

export default class ProfilePic extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <img
                src={this.props.url || "donut.svg"}
                onClick={this.props.onClick}
            />
        );
    }
}
