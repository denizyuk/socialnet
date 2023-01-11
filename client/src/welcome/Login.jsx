import { Component } from "react";
import { Link } from "react-router-dom";

const defaultState = {
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
};

export default class Login extends Component {
    constructor() {
        super();
        this.state = defaultState;

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state: ", this.state)
        );
    }

    validate() {
        let emailError = "";
        let passwordError = "";

        const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!this.state.email) {
            emailError = "Don't forget email ";
        } else if (reg.test(this.state.email) === false) {
            emailError = "Email Field is Invalid ";
        }
        if (!this.state.password) {
            passwordError = "Password field is required";
        }
        if (emailError || passwordError) {
            this.setState({
                emailError,
                passwordError,
            });
            return false;
        }
        return true;
    }

    handleSubmit() {
        if (this.validate()) {
            fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.state),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("data from POST /login: ", data);

                    if (data.success === true) {
                        this.setState(defaultState);
                        window.location.href = "/profile";
                    }
                })
                .catch((err) => {
                    console.log("error in submiting login", err);
                });
        }
    }

    render() {
        return (
            <div>
                <h1>Login</h1>
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="login-input"
                        value={this.state.email}
                        onChange={(e) => this.handleChange(e)}
                    />
                    <span className="error-msg">{this.state.emailError}</span>
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="login-input"
                        value={this.state.password}
                        onChange={(e) => this.handleChange(e)}
                    />
                    <span className="error-msg">
                        {this.state.passwordError}
                    </span>
                </div>

                <div>
                    <button
                        type="submit"
                        className="login-btn"
                        onClick={() => this.handleSubmit()}
                    >
                        Submit
                    </button>
                </div>
                <div className="forget-btn">
                    <Link to="/forgetPassword">forget password?</Link>
                </div>
                <div>
                    <Link to="/">
                        <button className="new-account-btn">
                            Create New Accout
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
}
