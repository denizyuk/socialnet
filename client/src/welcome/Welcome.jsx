import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Registration.jsx";
import Login from "./Login";
import ForgetPassword from "./ForgetPassword";

// styling later
import "../../../client/style.css";

export default function Welcome() {
    return (
        <div className="welcome-cont">
            <div className="welcome-sml-cont">
                <h1>fakeBook</h1>
            </div>
            <div className="forms-sml-cont">
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/test"
                            element={<ForgetPassword />}
                        ></Route>
                        <Route exact path="/" element={<Register />}></Route>
                        <Route path="/login" element={<Login />}></Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}
