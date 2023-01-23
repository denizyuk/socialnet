import { useState, useEffect } from "react";
import FriendButton from "./FriendButton.jsx";
import { Link } from "react-router-dom";

// styling

export default function Friends() {
    const [friends, setFriends] = useState([]);
    const [count, setCount] = useState([]);

    useEffect(() => {
        fetch(`/friends`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("friends data : ", data);
                setFriends(data.friends);
                setCount(data.count.count);
            });
    }, []);

    const YourFriends = ({ friends }) => {
        return (
            <>
                {friends.map(({ id, full_name, profile_pic, accepted }) => {
                    if (accepted) {
                        return (
                            <>
                                <ul>
                                    <li key={id}>
                                        <div>
                                            <Link
                                                to={`/users/${id}`}
                                                target="_blank"
                                            >
                                                <img
                                                    src={
                                                        profile_pic ||
                                                        "../emptyProfilePic.png"
                                                    }
                                                    alt=""
                                                />
                                            </Link>
                                        </div>
                                        <div>
                                            <p>{full_name}</p>

                                            <FriendButton friendsId={id} />
                                        </div>
                                    </li>
                                </ul>
                            </>
                        );
                    }
                })}
            </>
        );
    };

    const FriendRequests = ({ friends }) => {
        return (
            <>
                {friends.map(({ id, full_name, profile_pic, accepted }) => {
                    if (!accepted) {
                        return (
                            <>
                                <ul>
                                    <li key={id}>
                                        <div>
                                            <Link
                                                to={`/users/${id}`}
                                                target="_blank"
                                            >
                                                <img
                                                    src={
                                                        profile_pic ||
                                                        "/emptyProfliePic.png"
                                                    }
                                                    alt=""
                                                />
                                            </Link>
                                        </div>
                                        <div>
                                            <p>{full_name}</p>

                                            <FriendButton friendsId={id} />
                                        </div>
                                    </li>
                                </ul>
                            </>
                        );
                    }
                })}
            </>
        );
    };

    return (
        <div className="friends-big-cont">
            <>
                <h3>friends requests</h3>
                <div className="friends-sml-cont">
                    <FriendRequests friends={friends} />
                </div>
            </>
            <hr />
            <>
                <h3>Your friends ({count})</h3>
                <div className="friends-sml-cont">
                    <YourFriends friends={friends} />
                </div>
            </>
        </div>
    );
}
