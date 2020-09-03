import React, { useEffect, useState, useCallback } from "react";
import { Row, Col } from "reactstrap";
import CatContainer from "./CatContainer";
import ButtonBar from "./ButtonBar";
import API from "./API";
import askForPermission from "./askForPermission";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VelocityTransitionGroup } from "velocity-react";
import { render } from "@testing-library/react";


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSingleCat: localStorage.getItem("isSingleCat") === "true",
            isFaveCat: localStorage.getItem("isFaveCat") === "true",
            numOfCats: localStorage.getItem("numOfCats")
                ? +localStorage.getItem("numOfCats")
                : 15,
            imageSize: localStorage.getItem("imageSize")
                ? +localStorage.getItem("imageSize")
                : 4,

            buttonBarIsHidden: true,
            catArray: [],
            isLoading: true,
            errMessage: null
        }
    }

    setButtonBarIsHidden = val => {
        this.setState({
            buttonBarIsHidden: val
        })
    }

    handleChange = (event) => {
        const input = event.target;
        const value = input.type === "checkbox" ? input.checked : input.value;
        const name = input.name;

        this.locallyStoreAndSet(name, value)
    }

    locallyStoreAndSet = (name, value) => {
        this.setState({
            [name]: value
        })

        localStorage.setItem(name, value)
    }

    //The reloads and separate functions for getRandomsButton vs getRandoms is so that when the user switches between getting randoms and getting faves the UI displays the correct heart
    getRandomsButton = () => {
        window.location.reload(false);
        this.locallyStoreAndSet("isFaveCat", true);
        this.getRandoms();
    }
    getFavesButton = () => {
        window.location.reload(false);
        this.locallyStoreAndSet("isFaveCat", false);
        this.getFaves();
    }

    getRandoms = () => {
        this.locallyStoreAndSet("catArray", []);
        this.locallyStoreAndSet("isLoading", true);
        this.locallyStoreAndSet("errMessage", null);

        API.get("images/search?limit=100")
            .then(res => {
                this.locallyStoreAndSet("catArray", res.data);
                this.locallyStoreAndSet("isLoading", false);
                this.locallyStoreAndSet("errMessage", null);
            })
            .catch(err => {
                this.locallyStoreAndSet("catArray", []);
                this.locallyStoreAndSet("isLoading", false);
                this.locallyStoreAndSet("errMessage", "Error fetching cat images");
            });
    }
    recursiveGetFaves = (pageCount = 0, cats = []) => {
        API.get(`favourites`, {
            "params": {
                "page": pageCount,
                "sub_id": localStorage.getItem("userID")
            }
        })
            .then(res => {
                if (res && res.data && res.data.length) {
                    this.recursiveGetFaves(pageCount + 1, cats.concat(res.data))
                } else {
                    const unshuffledArray = cats.map((item) => {
                        const temp = item["image"];
                        temp["faveID"] = item.id;
                        return temp;
                    });
                    if (unshuffledArray && unshuffledArray.length) {
                        this.locallyStoreAndSet("catArray", this.shuffleArray(unshuffledArray.slice()));
                        this.locallyStoreAndSet("isLoading", false);
                        this.locallyStoreAndSet("errMessage", null);

                    } else {
                        this.locallyStoreAndSet("errMessage", "You don't have any favorites to display!");
                        this.locallyStoreAndSet("catArray", []);
                        this.locallyStoreAndSet("isLoading", false);
                    }
                    return unshuffledArray
                }
            })
            .catch(err => {
                this.locallyStoreAndSet("errMessage", "Error fetching cat images");
                this.locallyStoreAndSet("catArray", []);
                this.locallyStoreAndSet("isLoading", false);

                return err;
            });
    }

    //The requests are offloaded to a separate recursive function because the responses are in chunks of 100 so if a user has more than 100 favorites they need separate "pages" of results
    getFaves = () => {
        if (!localStorage.getItem("userID") && !askForPermission()) {
            console.log("no userID")
            return;
        }

        this.locallyStoreAndSet("isLoading", true);
        this.locallyStoreAndSet("errMessage", null);
        this.locallyStoreAndSet("catArray", []);


        this.recursiveGetFaves();
    }


    shuffleArray = array => {
        //This shuffles an array and only sends back one that is the size of 100 or the original array, whichever is smaller. This is so that the user can see all their favorites and not just the earliest stored ones
        const newArray = [];
        if (!array.length) return newArray;

        const upperBound = (array.length > 100) ? 99 : array.length - 1;
        let randomIndex;
        for (let i = upperBound; i >= 0; i--) {
            randomIndex = Math.floor(Math.random() * array.length);
            newArray.push(array[randomIndex])
            array.splice(randomIndex, 1);
        }
        return newArray;
    }

    componentDidMount = () => {
        if (this.state.isFaveCat) {
            this.getFaves();
        } else {
            this.getRandoms();
        }
    }

    //Beginning of rendering
    render() {
        let contentWrapper;
        if (this.state.isLoading) {
            contentWrapper =
                <div className="loadererrorContainer h-100">
                    <FontAwesomeIcon
                        icon={faCircleNotch}
                        className="fa-spin loading"
                    />
                </div>
        } else if (this.state.errMessage) {
            const errMessage = "error here"
            contentWrapper =
                <div className="loadererrorContainer h-100">
                    <h1 className="text-center errMessage">
                        {errMessage}
                    </h1>
                </div>

        } else if (this.state.isSingleCat) {
            contentWrapper =
                <CatContainer
                    catObject={this.state.catArray[0]}
                    isSingleCat={this.state.isSingleCat}
                />
        } else {
            const catCols = [];
            contentWrapper =
                <Row
                    className="m-0 px-4 flex-fill justify-content-center align-content-center"
                >
                    {catCols}
                </Row>
            const upperBound = this.state.numOfCats;
            let i;
            for (i = 0; i < upperBound; i++) {
                //This makes it so that there are not more catContainers than there are cats which would break the app
                if (i >= this.state.catArray.length) {
                    break;
                }
                catCols.push(
                    <Col
                        xs={this.state.imageSize}
                        key={i}
                        className="p-2"
                    >
                        <CatContainer
                            catObject={this.state.catArray[i]}
                            isSingleCat={this.state.isSingleCat}
                        />
                    </Col>
                );
            }
        }

        return (
            //Div was used instead of Container so that there was no need to override the built in width
            <div
                className="m-0 p-0 w-100 h-100 d-flex flex-column"
                onMouseEnter={() => this.setState({ buttonBarIsHidden: false })}
                onMouseLeave={() => this.setState({ buttonBarIsHidden: true })}
            >
                <VelocityTransitionGroup enter={{ animation: "slideDown" }} leave={{ animation: "slideUp" }}>
                    {this.state.buttonBarIsHidden ? null :
                        <ButtonBar
                            getFavesButton={this.getFavesButton}
                            getRandomsButton={this.getRandomsButton}
                            handleChange={this.handleChange}
                            isSingleCat={this.state.isSingleCat}
                            numOfCats={this.state.numOfCats}
                            imageSize={this.state.imageSize}
                        />
                    }
                </VelocityTransitionGroup>

                {contentWrapper}
            </div>
        );
    }
}

















export default Main;

