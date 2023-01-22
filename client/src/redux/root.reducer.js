import { combineReducers } from "redux";
import messagesReducer from "./messages.slice";

const rootReducer = combineReducers({
    messages: messagesReducer,
});

export default rootReducer;
