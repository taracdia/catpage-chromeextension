import React from "react";
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "reactstrap";
import TransitionWrapper from "./TransitionWrapper";

class CatContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alreadyInFaves: false,
            buttonIsHidden: true
        }
    }

    addOrDel = () => {
        if (this.state.alreadyInFaves) {
        } else {
        }
        this.setState({ alreadyInFaves: !this.state.alreadyInFaves })

    }

    handleButtonClick = () => {
        if (localStorage.getItem("userID") === null) {
            this.props.askForPermission(this.addOrDel);
        } else {
            this.addOrDel();
        }
    }

    changeButtonHidden = val => {
        this.setState({ buttonIsHidden: val })
    }

    render() {
        return (
            <div
            onMouseEnter={() => this.changeButtonHidden(false)}
            onMouseLeave={() => this.changeButtonHidden(true)}
            >
                <TransitionWrapper

                >
                    {this.state.buttonIsHidden ? null :
                        <div>
                            <Button
                                onClick={this.handleButtonClick}
                                className="btn btn-danger faveButton"
                            >
                                <FontAwesomeIcon
                                    icon={this.state.alreadyInFaves
                                        ? faHeartFilled : faHeartEmpty} />
                            </Button>
                        </div>
                    }
                </TransitionWrapper>
                <img className="border w-100" src={this.props.catImage} alt="cat" />
                </div>
        )
    }
}

export default CatContainer;