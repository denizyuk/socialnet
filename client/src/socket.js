import { io } from "socket.io-client";
import {
    chatMessageReceived,
    chatMessagesReceived,
} from "./redux/messages.slice.js";

export let socket;

export const initSocket = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (data) => {
            console.log("chatMessages in socket", data);

            store.dispatch(chatMessagesReceived(data));
        });

        socket.on("chatMessage", (data) =>
            store.dispatch(chatMessageReceived(data))
        );
    }
};
