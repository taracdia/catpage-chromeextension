import React from "react";
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, CardImg } from "reactstrap";
import TransitionWrapper from "./TransitionWrapper";
import API from "./API"
import { askForPermission } from "./Main";


class CatContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonIsHidden: true,
            isFave: (localStorage.getItem("isFaveCat") === "true")
        }
    }

    setButtonIsHidden = val => this.setState({ buttonIsHidden: val });

    handleButtonClick = () => {
        if (localStorage.getItem("userID")) {
            if (this.props.catObject.faveID) {
                this.deleteFave();
            } else {
                this.postFave();
            }
        } else {
            askForPermission();
        }
    }

    deleteFave = () => {
        API.delete(`favourites/${this.props.catObject.faveID}`)
            .then(res => {
                console.log(res)
                delete this.props.catObject.faveID;
                this.setState({isFave: false});
            })
            .catch(err => {
                //todo: handle
                console.log(err)
            })
    }

    postFave = () => {
        if (!localStorage.getItem("userID") && !this.props.askForPermission()) {
            return;
        }

        const postBody = {
            image_id: this.props.catObject.id,
            sub_id: localStorage.getItem("userID")
        }
        API.post('favourites', postBody)
            .then(res => {
                console.log(res.data.id)
                this.props.catObject.faveID = res.data.id;
                this.setState({isFave: true})
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        if (this.props.errMessage) {
            return (<div className="error">
                {this.props.errMessage}
            </div>)
        } else if (!this.props.catObject) {
            return (
                <div
                    className="loaderContainer"
                >
                    <FontAwesomeIcon
                        icon={faCircleNotch}
                        className="fa-spin loading"
                    />
                </div>
            )
        }

        return (
            <div
                // style={{
                //     "min-height": "100%",
                //     "width": "100%",
                // }}
                className="flex-fill border-red"
            >
                <Card
                    onMouseEnter={() => this.setButtonIsHidden(false)}
                    onMouseLeave={() => this.setButtonIsHidden(true)}
                    className="full-height cat-card middle border-red"
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
                                        icon={this.state.isFave
                                            ? faHeartFilled : faHeartEmpty} />
                                </Button>
                            </div>
                        }
                    </TransitionWrapper>
                    <CardImg
                        width="100%"
                        src={this.props.catObject.url}
                        alt="Cat"
                        className="full-height"
                    />
                </Card>
            </div>
        )
    }
}

export default CatContainer;