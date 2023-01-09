import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import Welcome from "./welcome/Welcome";

const root = createRoot(document.querySelector("main"));

fetch("/user/id.json")
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        if (!data.userId) {
            root.render(<Welcome />);
        } else {
            root.render(<App />);
        }
    });
