import { useParams } from "react-router";
import { useState, useEffect } from "react";

export default function FriendButton({ friendsId }) {
    const otherUserId = friendsId || useParams().id;

    const [btnState, setbtnState] = useState("");

    useEffect(() => {
        fetch(`/friendship/${otherUserId}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.data.length === 0) {
                    setbtnState("Make a Request");
                } else if (
                    data.data[0].accepted == false &&
                    data.data[0].sender_id === data.userId
                ) {
                    setbtnState("Cancel a Request");
                } else if (
                    data.data[0].accepted == false &&
                    data.data[0].sender_id_id !== data.userId
                ) {
                    setbtnState("Accept a Request");
                } else if (data.data[0].accepted == true) {
                    setbtnState("Unfriend");
                }
            });
    });

    function onRequestClick(e) {
        e.preventDefault();

        if (btnState === "Make a Request") {
            fetch(`/friendship/${otherUserId}`, {
                method: "POST",
            })
                .then((res) => res.json())
                .then(() => {
                    setbtnState("Cancel a Request");
                    window.location.reload();
                });
        } else if (btnState === "Cancel a Request" || btnState === "Unfriend") {
            fetch(`/friendship/cancel/${otherUserId}`, {
                method: "POST",
            })
                .then((res) => res.json())
                .then(() => {
                    setbtnState("Make a Request");
                    window.location.reload();
                });
        } else if (btnState === "Accept a Request") {
            fetch(`/friendship/accept/${otherUserId}`, {
                method: "POST",
            })
                .then((res) => res.json())
                .then(() => {
                    setbtnState("Make a Request");
                    window.location.reload();
                });
        }
    }

    return (
        <div>
            <button onClick={onRequestClick}>{btnState}Add Friend</button>
        </div>
    );
}
