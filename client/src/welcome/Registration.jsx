import { Component } from "react";
import { Link } from "react-router-dom";

// styling later;

const defaultState = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    first_nameError: "",
    last_nameError: "",
    emailError: "",
    passwordError: "",
};

export default class Register extends Component {
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
        let first_nameError = "";
        let last_nameError = "";
        let emailError = "";
        let passwordError = "";

        if (!this.state.first_name) {
            first_nameError = "Name field is required";
        }
        if (!this.state.last_name) {
            last_nameError = "Name field is required";
        }
        const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!this.state.email) {
            emailError = "Email Field is required ";
        } else if (reg.test(this.state.email) === false) {
            emailError = "Email Field is Invalid ";
        }
        if (!this.state.password) {
            passwordError = "Password field is required";
        }
        if (emailError || first_nameError || last_nameError || passwordError) {
            this.setState({
                first_nameError,
                last_nameError,
                emailError,
                passwordError,
            });
            return false;
        }
        return true;
    }

    handleSubmit() {
        if (this.validate()) {
            fetch("/registration", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.state),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("data from POST /registration: ", data);

                    if (data.success === true) {
                        this.setState(defaultState);
                        window.location.href = "/";
                    }
                })
                .catch((err) => {
                    console.log("error in submiting", err);
                });
        }
    }

    render() {
        return (
            <div>
                <h1>Sing Up</h1>
                <div className="back-login-btn">
                    <Link to="/Login">back to login!</Link>
                </div>
                <div>
                    <div>
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            className="register-input"
                            value={this.state.first_name}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <span>{this.state.first_nameError}</span>
                    </div>
                    <div>
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            className="register-input"
                            value={this.state.last_name}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <span>{this.state.last_nameError}</span>
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="register-input"
                            value={this.state.email}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <span>{this.state.emailError}</span>
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="register-input"
                            value={this.state.password}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <span>{this.state.passwordError}</span>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="register-btn"
                            onClick={() => this.handleSubmit()}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
