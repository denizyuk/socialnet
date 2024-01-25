export default function ProfilePic({
    profilePic,
    togglePopup,
    profilePicClass,
}) {
    profilePic = profilePic || "/emptyProfliePic.png";
    console.log("profile pic hello", profilePic);

    return (
        <div className="profilePic">
            <>
                <img
                    className={profilePicClass}
                    src={profilePic}
                    alt="..."
                    onClick={togglePopup}
                />
            </>
        </div>
    );
}
//