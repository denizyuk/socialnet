// import { createRoot } from "react-dom/client";
// import { App } from "./app/App";
// import Welcome from "./welcome/Welcome";

// const root = createRoot(document.querySelector("main"));

// fetch("/user/id.json")
//     .then((res) => res.json())
//     .then((data) => {
//         console.log(data);
//         if (!data.userId) {
//             root.render(<Welcome />);
//         } else {
//             root.render(<App />);
//         }
//     });

import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome/Welcome.jsx";
import { App } from "./app/App";
import rootReducer from "./redux/root.reducer.js";
import { Provider } from "react-redux";
import { initSocket } from "./socket.js";
import { createStore } from "redux";

const store = createStore(rootReducer);

class AppContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
        };
    }

    componentDidMount() {
        fetch("/user/id")
            .then((response) => response.json())
            .then((data) => {
                this.setState({ userId: data.userId });
            });
    }

    render() {
        if (!this.state.userId) {
            return <Welcome />;
        } else {
            initSocket(store);
            return (
                <Provider store={store}>
                    <App />
                </Provider>
            );
        }
    }
}

ReactDOM.render(<AppContainer />, document.querySelector("main"));
