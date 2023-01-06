import { Component, FormEvent } from "react";

interface RegistrationState {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
}

export class Registration extends Component<any, RegistrationState> {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
        };
    }

    handleSubmit = (evt: FormEvent) => {
        evt.preventDefault();
        console.log("evt: ", evt);
        fetch("/add-formdata", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                email: this.state.email,
                password: this.state.password,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {});
    };

    handleInputChange = (evt) => {
        evt.preventDefault();
        console.log("evt: ", evt.target.name);
        const property = evt.target.name;
        this.setState({ [property]: evt.target.value });
    };

    render = () => {
        console.log("state: ", this.state);
        return (
            <div>
                <h1>FakeBook</h1>
                {/* <Logo/> */}
                <p>Lorum ipsum</p>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <span>Firstname</span>
                        <input
                            type="text"
                            name="firstname"
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div>
                        <span>Lastname</span>
                        <input
                            type="text"
                            name="lastname"
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div>
                        <span>Email</span>
                        <input
                            type="email"
                            name="email"
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div>
                        <span>Password</span>
                        <input
                            type="password"
                            name="password"
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <button>Register</button>
                </form>
            </div>
        );
    };
}
