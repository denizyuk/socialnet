import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchUsers, setSearchUsers] = useState("");

    useEffect(() => {
        let abort;
        (async () => {
            const data = await fetch(`/findUsers/?q=${searchUsers}`, {
                method: "get",
            }).then((res) => res.json());
            if (!abort) {
                setUsers(data);
            }
        })();
        return () => {
            abort = true;
        };
    }, [searchUsers]);

    const updateSearchUsers = (value) => {
        return setSearchUsers(value);
    };

    const FindPeopleResult = ({ users }) => {
        return (
            <>
                {users.map((user) => (
                    <ul key={user.id}>
                        <li>
                            <Link to={`/users/${user.id}`} target="_blank">
                                <img
                                    src={
                                        user.profile_pic ||
                                        "../emptyProfilePic.png"
                                    }
                                    alt=""
                                />
                            </Link>
                            <p>{user.full_name}</p>
                        </li>
                    </ul>
                ))}
            </>
        );
    };

    return (
        <div className="find-people-big-cont">
            <h3>Find people now </h3>
            <input
                type="text"
                onChange={(e) => {
                    updateSearchUsers(e.target.value);
                }}
            />

            <div className="find-people-sml-cont">
                <FindPeopleResult users={users} />
            </div>
        </div>
    );
}
