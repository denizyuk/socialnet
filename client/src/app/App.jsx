import { Component } from "react";

import "../../../client/style.css";

import Logo from "./Logo.jsx";
import ProfilePic from "./ProfilePic.jsx";
import Profile from "./Profile.jsx";

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = { isPopupOpen: false };
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

                    <Profile
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                        fullName={this.state.fullName}
                        profilePic={this.state.profilePic}
                        bio={this.state.bio}
                        updateBio={this.updateBio}
                        togglePopup={this.togglePopup}
                    />
                </div>
            </div>
        );
    }
}
