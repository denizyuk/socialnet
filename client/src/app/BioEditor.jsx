import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            draftBio: "",
            isEditing: false,
        };

        console.log({ props });
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

    toggleisEditing() {
        this.setState({
            isEditing: !this.state.isEditing,
        });
    }

    handleSubmitBio(e) {
        const newBio = this.state.draftBio;
        e.preventDefault();
        fetch("/bio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newBio }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success === true) {
                    this.setState({ isEditing: false });
                    this.props.updateBio(newBio);
                }
            })
            .catch((err) => {
                console.log("error in ", err);
            });
    }

    bioEditorSteps() {
        if (this.props.bio === null) {
            if (this.state.isEditing === true) {
                return (
                    <>
                        <textarea
                            name="draftBio"
                            onChange={(e) => this.handleChange(e)}
                        ></textarea>
                        <button onClick={(e) => this.handleSubmitBio(e)}>
                            save bio
                        </button>
                    </>
                );
            } else {
                return (
                    <>
                        <button onClick={() => this.toggleisEditing()}>
                            add a bio
                        </button>
                    </>
                );
            }
        } else {
            if (this.state.isEditing === true) {
                return (
                    <>
                        <textarea
                            name="draftBio"
                            onChange={(e) => this.handleChange(e)}
                        ></textarea>
                        <button onClick={(e) => this.handleSubmitBio(e)}>
                            save bio
                        </button>
                    </>
                );
            } else {
                return (
                    <>
                        <p>{this.props.bio}</p>
                        <button onClick={() => this.toggleisEditing()}>
                            edit your bio
                        </button>
                    </>
                );
            }
        }
    }

    render() {
        return (
            <div>
                <div> {this.bioEditorSteps()} </div>
            </div>
        );
    }
}
