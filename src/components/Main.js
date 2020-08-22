/* global chrome */
import React from "react";
import { Row, Container, Col } from "reactstrap";
import CatContainer from "./CatContainer";
import ButtonBar from "./ButtonBar";
import TransitionWrapper from "./TransitionWrapper";

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.wrapperRef = React.createRef();

        this.state = {
            isSingleCat: localStorage.getItem("isSingleCat") === "true",

            isFaveCat: localStorage.getItem("isFaveCat") === "true",
            numOfCats:
                (localStorage.getItem("numOfCats"))
                    ? localStorage.getItem("numOfCats")
                    : 13,
            imageSize:
                (localStorage.getItem("imageSize"))
                    ? localStorage.getItem("imageSize")
                    : 4,
            buttonBarIsHidden: true
        }

    }

    setUserID = () => {
        chrome.identity.getProfileUserInfo(function (userInfo) {
            var userID = JSON.stringify(userInfo["id"]);
            userID = userID.replace(/"/g, "");
            if (userID !== "") {
                localStorage.setItem("userID", userID);
            }
        });
    }

    askForPermission = (callback) => {
        chrome.permissions.request({
            permissions: ["identity.email"]
        }, (granted) => {
            // The callback argument will be true if the user granted the permissions.
            if (granted) {
                chrome.identity.getProfileUserInfo(function (userInfo) {
                    var userID = JSON.stringify(userInfo["id"]);
                    userID = userID.replace(/"/g, "");
                    if (userID === "") {
                        alert("Sorry, you need to be signed in to save your favorites")
                    } else {
                        alert("You can save your favorites now");
                        console.log("before callback")
                        localStorage.setItem("userID", userID);
                        callback();
                    }
                });
            } else {
                alert("You will not be able to save your favorites");
            }
        });
    }

    handleChange = event => {
        const input = event.target;
        const value = input.type === "checkbox" ? input.checked : input.value;
        const name = input.name;
        this.locallyStoreAndSetState(name, value);
    }
    locallyStoreAndSetState = (name, value) => {
        this.setState({ [name]: value });
        localStorage.setItem(name, value);
    }
    getFaveCats = () => {
        this.locallyStoreAndSetState("isFaveCat", true);
        console.log("fave")
    }

    getRandomCats = () => {
        this.locallyStoreAndSetState("isFaveCat", false);
        console.log("random");
    }

    setButtonBarHiddenValue = val => {
        this.setState({ "buttonBarIsHidden": val });
    }

    render() {
        console.log(this.state.imageSize)
        let catContainers;
        if (this.state.isSingleCat) {
            catContainers =
                <CatContainer
                    isSingleCat={this.state.isSingleCat}
                    catImage=".\tab-icon.png"
                    askForPermission={callback => this.askForPermission(callback)}
                />
        } else {
            const catColumns = [];
            catContainers = <Row>{catColumns}</Row>
            let i;
            const upperBound = this.state.numOfCats;
            for (i = upperBound; i > 0; i--) {
                catColumns.push(
                    <Col
                        xs={this.state.imageSize}
                        className="m-0 p-0">
                        <CatContainer
                            key={i}
                            isSingleCat={this.state.isSingleCat}
                            catImage=".\tab-icon.png"
                            askForPermission={callback => this.askForPermission(callback)}
                        />
                    </Col>
                );
            }
        }
        return (
            <Container
                className="full-height-width"
                onMouseEnter={() => this.setButtonBarHiddenValue(false)}
                onMouseLeave={() => this.setButtonBarHiddenValue(true)}
            >
                <TransitionWrapper>
                    {this.state.buttonBarIsHidden ? null :
                        <ButtonBar
                            className="border"
                            isSingleCat={this.state.isSingleCat}
                            imageSize={this.state.imageSize}
                            numOfCats={this.state.numOfCats}
                            getFaveCats={this.getFaveCats}
                            getRandomCats={this.getRandomCats}
                            handleChange={this.handleChange}
                        />
                    }
                </TransitionWrapper>
                {catContainers}
            </Container>
        );
    }
}


export default Main;