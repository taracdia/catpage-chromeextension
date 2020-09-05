import React from "react";
import { Row, Col } from "reactstrap";
import CatContainer from "./CatContainer";
import ButtonBar from "./ButtonBar";
import API from "./API";
import askForPermission from "./askForPermission";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VelocityTransitionGroup } from "velocity-react";


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSingleCat: localStorage.getItem("isSingleCat") 
            ? localStorage.getItem("isSingleCat") === "true" 
            : true,
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

    setButtonBarIsHidden = val => this.setState({ buttonBarIsHidden: val })

    handleChange = (event) => {
        const input = event.target;
        const value = input.type === "checkbox" ? input.checked : input.value;
        const name = input.name;

        this.locallyStoreAndSet(name, value)
    }

    locallyStoreAndSet = (name, value) => {
        this.setState({ [name]: value })
        localStorage.setItem(name, value)
    }

    getRandoms = () => {
        this.locallyStoreAndSet("isFaveCat", false);

        this.locallyStoreAndSet("catArray", []);
        this.locallyStoreAndSet("isLoading", true);
        this.locallyStoreAndSet("errMessage", null);

        API.get("images/search?limit=100")
            .then(res => {
                this.locallyStoreAndSet("catArray", res.data);
                this.locallyStoreAndSet("isLoading", false);
                this.locallyStoreAndSet("errMessage", null);
            })
            .catch(() => {
                this.locallyStoreAndSet("catArray", []);
                this.locallyStoreAndSet("isLoading", false);
                this.locallyStoreAndSet("errMessage", "Error fetching cat images");
            });
    }

    //The requests are offloaded to a separate recursive function because the responses are in chunks of 100 so if a user has more than 100 favorites they need separate "pages" of results
    getFaves = () => {
        if (!localStorage.getItem("userID") && !askForPermission()) return;

        this.locallyStoreAndSet("isFaveCat", true);

        this.locallyStoreAndSet("isLoading", true);
        this.locallyStoreAndSet("errMessage", null);
        this.locallyStoreAndSet("catArray", []);

        try {
            let unshuffledArray = [];
            let promises = [];
            const upperBound = Math.ceil(localStorage.getItem("numOfFaves") / 100);
            let i;
            for (i = 0; i <= upperBound; i++) {
                promises.push(
                    API.get(`favourites`, {
                        "params": {
                            "page": i,
                            "sub_id": localStorage.getItem("userID")
                        }
                    }).then(response => {
                        unshuffledArray.push(...response.data)
                    })
                )
            }

            Promise.all(promises).then(() => {
                if (unshuffledArray && unshuffledArray.length) {
                    const formattedArray = unshuffledArray.map((item) => {
                        const temp = item["image"];
                        temp["faveID"] = item.id;
                        return temp;
                    });
                    this.locallyStoreAndSet("catArray", this.shuffleArray(formattedArray));
                    this.locallyStoreAndSet("isLoading", false);
                    this.locallyStoreAndSet("errMessage", null);

                } else {
                    this.locallyStoreAndSet("errMessage", "You don't have any favorites to display!");
                    this.locallyStoreAndSet("catArray", []);
                    this.locallyStoreAndSet("isLoading", false);
                }
            });
        } catch {
            this.locallyStoreAndSet("errMessage", "Error fetching cat images");
            this.locallyStoreAndSet("catArray", []);
            this.locallyStoreAndSet("isLoading", false);
        }
    }


    shuffleArray = array => {
        //This shuffles an array and only sends back one that is the size of 100 or the original array, whichever is smaller. This is so that the user can see all their favorites and not just the earliest stored ones
        const newArray = [];
        if (!array.length) return newArray;

        const upperBound = (array.length > 100) ? 100 : array.length;
        let randomIndex;
        for (let i = 0; i < upperBound; i++) {
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
            contentWrapper =
                <div className="loadererrorContainer h-100">
                    <h1 className="text-center errMessage">
                        {this.state.errMessage}
                    </h1>
                </div>

        } else if (this.state.isSingleCat) {
            contentWrapper =
                <CatContainer
                    catObject={this.state.catArray[0]}
                    isSingleCat={this.state.isSingleCat}
                    isFaveCat={this.state.isFaveCat}
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
                            isFaveCat={this.state.isFaveCat}

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
                            getFaves={this.getFaves}
                            getRandoms={this.getRandoms}
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

