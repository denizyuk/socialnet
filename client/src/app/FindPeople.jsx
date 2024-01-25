import { useState, useEffect } from "react"; //
import { Link } from "react-router-dom";

import "../../../client/style.css";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchUsers, setSearchUsers] = useState("");

    useEffect(() => {
        let abort;
        fetch(`/findUsers/${searchUsers}`)
            .then((res) => res.json())
            .then((data) => {
                if (!abort) {
                    setUsers(data);
                }
            });

        return () => {
            abort = true;
        };
    }, [searchUsers]);

    const updateSearchUsers = (value) => {
        console.log(value);
        setSearchUsers(value);
    };

    const FindPeopleResult = ({ users }) => {
        return (
            <>
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            <Link to={`/users/${user.id}`}>
                                <img
                                    src={
                                        user.profile_pic ||
                                        "/emptyProfliePic.png"
                                    }
                                    alt=""
                                />
                                {user.first_name}&nbsp;{user.last_name}
                            </Link>
                            <p>{user.fullName}</p>
                        </li>
                    ))}
                </ul>
            </>
        );
    };
    console.log(searchUsers);
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
