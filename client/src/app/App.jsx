import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

import "../../../client/style.css";

import Logo from "./Logo.jsx";
import ProfilePic from "./ProfilePic.jsx";
import Profile from "./Profile.jsx";

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <div className="app-header">
                    <div className="logo">
                        <Logo />
                    </div>
                    <div className="small-pic">
                        <ProfilePic
                            profilePic={this.state.profilePic}
                            togglePopup={this.togglePopup}
                            profilePicClass={"sml-profile-pic"}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
// add a logo component
//
