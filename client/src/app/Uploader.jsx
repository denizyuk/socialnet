export default function Uploader({ setProfilePic }) {
    const onFormSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        const formData = new FormData(form);
        fetch("/profilePic", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success === true) {
                    console.log(data.message);

                    const newProfilePic = data.profilePic;
                    setProfilePic(newProfilePic);
                } else {
                    console.log(data.message);
                }
            });
    };
//
    return (
        <div className="profilePicUploader-bigcont">
            <form
                className="profilePicUploader-smlcont"
                onSubmit={onFormSubmit}
            >
                <p>Please upload your profile pic</p>
                <input type="file" accept="image/*" name="file" />

                <input type="submit" value="Upload" />
            </form>
        </div>
    );
}
