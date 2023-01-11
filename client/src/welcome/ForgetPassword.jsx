import { Component } from "react";
import { Link } from "react-router-dom";

const defaultState = {
    email: "",
    emailError: "",
    passwordCode: "",
    passwordCodeError: "",
    newPassword: "",
    step: 1,
};

export default class ForgetPassword extends Component {
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

    emailValidate() {
        let emailError = "";

        const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!this.state.email) {
            emailError = "Email Field is required ";
        } else if (reg.test(this.state.email) === false) {
            emailError = "Email Field is Invalid ";
        }
        if (emailError) {
            this.setState({
                emailError,
            });
            return false;
        }
        return true;
    }

    handleSubmitEmail() {
        if (this.emailValidate()) {
            fetch("/forgetPassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.state),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success === true) {
                        this.setState({ step: 2 });
                        alert("Your Code is: " + data.passCode);
                    }
                })
                .catch((err) => {
                    console.log("error in ", err);
                });
        }
    }

    handleSubmitPassword() {
        fetch("/resetPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("data from POST /resetPassword: ", data);

                if (data.success === true) {
                    this.setState({ step: 3 });
                }
            })
            .catch((err) => {
                console.log("error in ", err);
            });
    }

    forgetPasswordSteps() {
        if (this.state.step === 1) {
            return (
                <div>
                    <h1>Reset Password</h1>

                    <div className="back-login-btn">
                        <Link to="/">back to login!</Link>
                    </div>

                    <div>
                        <h4>Enter your Email address</h4>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="forget-password-input"
                            value={this.state.email}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <span>{this.state.emailError}</span>
                    </div>

                    <button
                        type="submit"
                        className="forget-password-btn"
                        onClick={() => this.handleSubmitEmail()}
                    >
                        Submit
                    </button>
                </div>
            );
        } else if (this.state.step === 2) {
            return (
                <div>
                    <h1>Reset Password</h1>
                    <div className="back-login-btn">
                        <Link to="/">back to login!</Link>
                    </div>
                    <div>
                        <h4 className="forget-password-label">
                            Enter the Code
                        </h4>
                        <input
                            type="text"
                            name="passwordCode"
                            placeholder="Verification Code"
                            className="forget-password-input"
                            value={this.state.passwordCode}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <span>{this.state.emailError}</span>
                    </div>
                    <div>
                        <h4 className="forget-password-label">
                            Enter new Password
                        </h4>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            className="forget-password-input"
                            value={this.state.newPassword}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <span>{this.state.passwordError}</span>
                    </div>
                    <button
                        type="submit"
                        className="forget-password-btn"
                        onClick={() => this.handleSubmitPassword()}
                    >
                        Submit
                    </button>
                </div>
            );
        } else {
            return (
                <div>
                    <h1>Reset Password</h1>
                    <div className="success">
                        <p>Success!</p>
                    </div>
                    <div className="success-link">
                        <Link to="/">You can now login!</Link>
                    </div>
                </div>
            );
        }
    }

    render() {
        return <div> {this.forgetPasswordSteps()} </div>;
    }
}
