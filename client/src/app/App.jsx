import { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "../../../client/style.css";

import Logo from "./Logo.jsx";
import ProfilePic from "./ProfilePic.jsx";
import Profile from "./Profile.jsx";
import Uploader from "./Uploader.jsx";
import FindPeople from "./FindPeople.jsx";
import OtherProfile from "./OtherProfile.jsx";

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPopupOpen: false,
            firstName: "",
            lastName: "",
            fullName: "",
            profilePic: "",
            bio: "",
        };

        this.togglePopup = this.togglePopup.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        fetch("/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("datam nerede o ce ", data);
                this.setState({
                    firstName: data.first_name,
                    lastName: data.last_name,
                    fullName: data.full_name,
                    profilePic: data.profile_pic,
                    bio: data.bio,
                });
            })
            .catch((err) => {
                console.log("error in submiting login", err);
            });
    }

    togglePopup() {
        this.setState({
            isPopupOpen: !this.state.isPopupOpen,
        });
    }

    setProfilePic(newProfilePic) {
        this.setState({
            profilePic: newProfilePic,
        });
        this.togglePopup();
    }

    updateBio(newBio) {
        this.setState({
            bio: newBio,
        });
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
                    <div>
                        <p>{this.state.firstName}</p>
                    </div>
                    <div>
                        {this.state.isPopupOpen && (
                            <Uploader
                                setProfilePic={(newProfilePic) => {
                                    this.setProfilePic(newProfilePic);
                                }}
                            />
                        )}
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
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<FindPeople />}></Route>
                            <Route path="/" element={<OtherProfile />}></Route>
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        );
    }
}
