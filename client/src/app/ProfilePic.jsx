export default function ProfilePic({
    profilePic,
    togglePopup,
    profilePicClass,
}) {
    profilePic = profilePic || "client/public/emptyProfliePic.png";

    return (
        <>
            <img
                className={profilePicClass}
                src={profilePic}
                alt="..."
                onClick={togglePopup}
            />
        </>
    );
}
