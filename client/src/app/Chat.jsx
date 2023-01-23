// import { useSelector } from "react-redux";
// import { useState } from "react";
// import { socket } from "../socket.js";

// export default function Chat() {
//     const messages = useSelector((state) => state.messages);
//     const [message, setMessage] = useState("");

//     const onChatKeyDown = (e) => {
//         if (e.code === "Enter") {
//             e.preventDefault();
//             socket.emit("chatMessage", message.trim());
//             setMessage("");
//         }
//     };

//     const onMessageChange = (e) => {
//         setMessage(e.target.value);
//     };

//     const x = messages;
//     console.log("messages in x", x);

//     return (
//         <div className="chat-big-cont">
//             <div className="chats-cont">
//                 <ul>
//                     {x?.map((message) => (
//                         <li key={message.id}>
//                             <div className="chat-user">
//                                 <img
//                                     src={
//                                         message.profile_pic ||
//                                         "../emptyProfilePic.png"
//                                     }
//                                     style={{
//                                         width: 70,
//                                         height: 70,
//                                         objectFit: "cover",
//                                     }}
//                                     alt=""
//                                 />
//                                 <p>{message.full_name}</p>
//                             </div>
//                             <div className="chat-chat">
//                                 <p>{message.message}</p>
//                             </div>
//                             <span>{message.create_at}</span>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//             <div className="new-message">
//                 <textarea
//                     name="message"
//                     placeholder="Your message here"
//                     onKeyDown={(e) => onChatKeyDown(e)}
//                     onChange={(e) => onMessageChange(e)}
//                     value={message}
//                 ></textarea>
//             </div>
//         </div>
//     );
// }

import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

export default function Chat() {
    const messages = useSelector((state) => state.messages);
    const [message, setMessage] = useState("");
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io("http://localhost:3000");
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const onChatKeyDown = (e) => {
        if (e.code === "Enter") {
            e.preventDefault();
            socketRef.current.emit("chatMessage", message.trim());
            setMessage("");
        }
    };

    const onMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const x = messages;
    console.log("messages in x", x);

    return (
        <div className="chat-big-cont">
            <div className="chats-cont">
                <ul>
                    {x?.map((message) => (
                        <li key={message.id}>
                            <div className="chat-user">
                                <img
                                    src={
                                        message.profile_pic ||
                                        "../emptyProfilePic.png"
                                    }
                                    style={{
                                        width: 70,
                                        height: 70,
                                        objectFit: "cover",
                                    }}
                                    alt=""
                                />
                                <p>{message.full_name}</p>
                            </div>
                            <div className="chat-chat">
                                <p>{message.message}</p>
                            </div>
                            <span>{message.create_at}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="new-message">
                <textarea
                    name="message"
                    placeholder="Your message here"
                    onKeyDown={(e) => onChatKeyDown(e)}
                    onChange={(e) => onMessageChange(e)}
                    value={message}
                ></textarea>
            </div>
        </div>
    );
}
