/* eslint-disable indent */
export const CHAT_MESSAGES_RECEIVED = "/messages/receivedMany";
export const CHAT_MESSAGE_RECEIVED = "/messages/receivedOne";

export default function messagesReducer(messages = [], action) {
    switch (action.type) {
        case CHAT_MESSAGES_RECEIVED:
            console.log("all messages:", action.payload.messages);
            return action.payload.messages;

        case CHAT_MESSAGE_RECEIVED:
            console.log("messages: ", messages);
            console.log("action :", action.payload.message);

            return [action.payload.message, ...messages];

        default:
            return messages;
    }
}

export function chatMessagesReceived(messages) {
    return {
        type: CHAT_MESSAGES_RECEIVED,
        payload: { messages },
    };
}

export function chatMessageReceived(message) {
    return {
        type: CHAT_MESSAGE_RECEIVED,
        payload: { message },
    };
}
