import React from "react";
import { Row, Col } from "reactstrap";
import CatContainer from "./CatContainer";
import ButtonBar from "./ButtonBar";
import API from "./API";
import askForPermission from "./askForPermission";
import { faCircleNotch }
    from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon }
    from "@fortawesome/react-fontawesome";
import { VelocityTransitionGroup } from "velocity-react";


class Main extends React.Component {
    constructor(props) {
        super(props);
        /*
            Initial state is based on previously set user 
            preferences or default values
        */
        this.state = {
            isSingleCat:
                localStorage.getItem("isSingleCat")
                    ? (localStorage.getItem("isSingleCat")
                        === "true")
                    : true,
            isFaveCat:
                localStorage.getItem("isFaveCat") === "true",
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

    setButtonBarIsHidden = val => this.setState({
        buttonBarIsHidden: val
    });

    /*
        Handle inputs from the form in the button bar
    */
    handleChange = (event) => {
        const input = event.target;
        const value = input.type === "checkbox"
            ? input.checked : input.value;
        const name = input.name;

        this.locallyStoreAndSet(name, value);
    }

    /*
        Variables are stored in local storage to save user 
        preferences and stored in the state for speed
    */
    locallyStoreAndSet = (name, value) => {
        this.setState({ [name]: value });
        localStorage.setItem(name, value);
    }

    getRandoms = () => {
        this.locallyStoreAndSet("isFaveCat", false);
        /*
            Update settings for while the get request is 
            resolving
        */
        this.locallyStoreAndSet("catArray", []);
        this.locallyStoreAndSet("isLoading", true);
        this.locallyStoreAndSet("errMessage", null);

        /*
            Limit is 100 because it is about as fast to 
            load 100 as it is to load 10 and this way there 
            is no need to make additional get requests when 
            the user changes the number of cats to display
        */
        API.get("images/search?limit=100")
            .then(res => {
                this.locallyStoreAndSet("catArray",
                    res.data);
                this.locallyStoreAndSet("isLoading", false);
                this.locallyStoreAndSet("errMessage", null);
            })
            .catch(() => {
                this.locallyStoreAndSet("catArray", []);
                this.locallyStoreAndSet("isLoading", false);
                this.locallyStoreAndSet("errMessage",
                    "Error fetching cat images");
            });
    }

    getFaves = () => {
        /*
            If there is no userID already saved, ask for it 
            and only continue with the function if they 
            grant permission and their userID is saved
        */
        if (!localStorage.getItem("userID") &&
            !askForPermission()) return;

        this.locallyStoreAndSet("isFaveCat", true);
        /*
            Update settings for while the get request is 
            resolving
        */
        this.locallyStoreAndSet("isLoading", true);
        this.locallyStoreAndSet("errMessage", null);
        this.locallyStoreAndSet("catArray", []);

        /*
            Wrapping everything in a try-catch block 
            because if the function fails at any point the 
            error handling is the same so this avoids 
            unnecessary .catch() blocks
        */
        try {
            /*
                Promises are collected in an array so that processing of the results array does not occur until all responses are collected.
            */
            let responseArray = [];
            let promises = [];
            /*
                Each request for favorites returns an array 
                with a maximum length of 100. If the user 
                has more than that, we need to separate the 
                request into multiple requests with pages. 
                Each page is 100 favorites. 
            */
            const upperBound = Math.floor(
                localStorage.getItem("numOfFaves")
                / 100);
            let i;
            for (i = 0; i <= upperBound; i++) {
                promises.push(
                    API.get("favourites", {
                        "params": {
                            "page": i,
                            "sub_id":
                                localStorage.getItem("userID")
                        }
                    }).then(response => {
                        responseArray.push(
                            ...response.data)
                    })
                );
            }

            Promise.all(promises).then(() => {
                if (!responseArray) {
                    throw new Error();
                }
                /*
                    This is in case the numOfFaves variable 
                    becomes incorrect, it will be corrected 
                    every time the user requests their 
                    favorites.
                */
                localStorage.setItem("numOfFaves",
                    responseArray.length);

                if (responseArray.length) {
                    const formattedArray =
                        responseArray.map((item) => {
                            const temp = item["image"];
                            temp["faveID"] = item.id;
                            return temp;
                        });
                    const shuffledArray = this.shuffleArray(formattedArray);
                    this.locallyStoreAndSet("catArray",
                        shuffledArray);
                    this.locallyStoreAndSet("isLoading",
                        false);
                    this.locallyStoreAndSet("errMessage",
                        null);

                } else {
                    this.locallyStoreAndSet("errMessage",
                        `You don't have any favorites to 
                        display!`);
                    this.locallyStoreAndSet("catArray", []);
                    this.locallyStoreAndSet("isLoading",
                        false);
                }
            });
        } catch {
            this.locallyStoreAndSet("errMessage",
                "Error fetching cat images");
            this.locallyStoreAndSet("catArray", []);
            this.locallyStoreAndSet("isLoading", false);
        }
    }


    shuffleArray = array => {
        /*
            This shuffles an array and only sends back one 
            that is the size of 100 or the original array, 
            whichever is smaller. This is so that the user 
            can see all their favorites and not just the 
            earliest stored ones.
        */
        const newArray = [];
        if (!array.length) return newArray;

        const upperBound = (array.length > 100) ?
            100 : array.length;
        let randomIndex;
        for (let i = 0; i < upperBound; i++) {
            randomIndex = Math.floor(
                Math.random() * array.length);
            newArray.push(array[randomIndex]);
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
                    className="m-0 px-4 flex-fill 
                    justify-content-center 
                    align-content-center"
                >
                    {catCols}
                </Row>
            const upperBound = this.state.numOfCats;
            let i;
            for (i = 0; i < upperBound; i++) {
                /*
                    This makes it so that there are not 
                    more catContainers than there are cats 
                    which would break the app
                */
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
                            catObject=
                            {this.state.catArray[i]}
                            isSingleCat=
                            {this.state.isSingleCat}
                            isFaveCat={this.state.isFaveCat}
                        />
                    </Col>
                );
            }
        }

        return (
            /*
                Div was used instead of Container so that 
                there was no need to override the built in 
                width
            */
            <div
                className="m-0 p-0 w-100 h-100 d-flex 
                flex-column"
                onMouseEnter={() => this.setState({
                    buttonBarIsHidden: false
                })}
                onMouseLeave={() => this.setState({
                    buttonBarIsHidden: true
                })}
            >
                {/* 
                    This allows the ButtonBar to slide up 
                    and down when the mouse enters and 
                    exits.
                */}
                <VelocityTransitionGroup
                    enter={{ animation: "slideDown" }}
                    leave={{ animation: "slideUp" }}>
                    {this.state.buttonBarIsHidden ? null :
                        <ButtonBar
                            getFaves={this.getFaves}
                            getRandoms={this.getRandoms}
                            handleChange={this.handleChange}
                            isSingleCat=
                            {this.state.isSingleCat}
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