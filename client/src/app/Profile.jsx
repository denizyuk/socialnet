import ProfilePic from "./ProfilePic.jsx";
import BioEditor from "./BioEditor.jsx";

import "../../../client/style.css";

export default function Profile(props) {
    return (
        <>
            <div className="profile-big-cont">
                <div>
                    <ProfilePic
                        profilePic={props.profilePic}
                        togglePopup={props.togglePopup}
                        profilePicClass={"big-profile-pic"}
                    />
                </div>
                <div>
                    <h2>{props.fullName}</h2>

                    <div className="bio-cont">
                        <BioEditor
                            bio={props.bio}
                            updateBio={props.updateBio}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
