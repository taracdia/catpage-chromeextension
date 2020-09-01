/* global chrome */
import React from "react";
import { Row, Container, Col } from "reactstrap";
import CatContainer from "./CatContainer";
import ButtonBar from "./ButtonBar";
import TransitionWrapper from "./TransitionWrapper";
import API from "./API"

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            buttonBarIsHidden: true,
            catArray: [],
            isLoading: true,
            errMessage: null
        }
    }

    // const [buttonBarIsHidden, setButtonBarIsHidden] = useState(true);
    // const [catArray, setCatArray] = useState([]);
    // const [isLoading, setisLoading] = useState(true);
    // const [errMessage, setErrMessage] = useState(null);

    handleChange = event => {
        const input = event.target;
        const value = input.type === "checkbox" ? input.checked : input.value;
        const name = input.name;
        localStorage.setItem(name, value);

        //todo: make it reload when the nuOfcats changes or else you get loaders
        //possibly just append to catList? that way they get to keep the cats they are already looking at
    }

    setButtonBarHiddenValue = val => {
        this.setState({ "buttonBarIsHidden": val });
    }

    getRandomsButton = () => {
        window.location.reload(false);
        this.getRandoms();
    }
    getFavesButton = () => {
        window.location.reload(false);
        this.getFaves();
    }

    getRandoms = () => {
        localStorage.setItem("isFaveCat", false);
        let limit = 1;
        if (localStorage.getItem("isSingleCat") === "false") {
            limit = +localStorage.getItem("numOfCats")
        }
        const inScopeThis = this;
        API.get(`images/search?limit=${limit}`)
            .then(res => {
                console.log(res.data)
                inScopeThis.setState({
                    "isLoading": false,
                    "errMessage": null,
                    "catArray": res.data
                });
            })
            .catch(err => {
                //todo: handle err
                console.log(err)
                inScopeThis.setState({
                    "isLoading": false,
                    "errMessage": "Error fetching this cat image",
                    "catArray": []
                });
            })
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
                    this.setState({
                        "isLoading": false,
                        "errMessage": null,
                        "catArray": this.shuffleArray(unshuffledArray.slice())
                    });
                    return unshuffledArray
                }
            })
            .catch(err => {
                //todo: handle err
                console.log(err)
                this.setState({
                    "isLoading": false,
                    "errMessage": "Error fetching this cat image",
                    "catArray": []
                });
                return err;
            })
    }

    shuffleArray = array => {
        //This shuffles an array and only sends back one that is the size of numOfCats or the original array, whichever is smaller
        const newArray = [];
        if (!array.length) return newArray;

        let upperBound = array.length - 1;
        if (localStorage.getItem("isSingleCat") === "true") {
            upperBound = 1;
        } else if (upperBound <= array.length) {
            upperBound = +localStorage.getItem("numOfCats") - 1;
        }
        let randomIndex;
        for (let i = upperBound; i >= 0; i--) {
            randomIndex = Math.floor(Math.random() * array.length);
            newArray.push(array[randomIndex])
            array.splice(randomIndex, 1);
        }
        return newArray;
    }

    getFaves = () => {
        if (!localStorage.getItem("userID") && !askForPermission()) {
            console.log("no userID")
            return;
        }
        localStorage.setItem("isFaveCat", true);
        this.recursiveGetFaves();
    }

    componentDidMount = () => {
        if (localStorage.getItem("isFaveCat") === "true") {
            this.getFaves();
        } else {
            this.getRandoms();
        }
    }

    componentWillMount = () => {
        //Setting initial options so they don't have to be checked every time
        if(!localStorage.getItem("isFaveCat")){
            localStorage.setItem("isFaveCat", false)
        }
        if(!localStorage.getItem("isSingleCat")){
            localStorage.setItem("isSingleCat", true)
        }
        if(!localStorage.getItem("numOfCats")){
            localStorage.setItem("numOfCats", 15)
        }
        if(!localStorage.getItem("imageSize")){
            localStorage.setItem("imageSize", 4)
        }
    }

    render() {
        let catWrapper;
        const buttonBar =
            <TransitionWrapper>
                {this.state.buttonBarIsHidden ? null :
                    <ButtonBar
                        getFavesButton={this.getFavesButton}
                        getRandomsButton={this.getRandomsButton}
                        handleChange={this.handleChange}
                    />
                }
            </TransitionWrapper>

        if (!this.state.catArray.length && !this.state.errMessage && !this.state.isLoading) {
            //todo: fix this css too
            catWrapper =
                <div className="full-height justify-content-center d-flex align-items-center">
                    <h1 className="text-center noFaves">
                        You don't have any favorites to display!
        </h1>
                </div>

        } else if ((localStorage.getItem("isSingleCat") === "true")) {
            catWrapper =
                <CatContainer
                    catObject={this.state.catArray[0]}
                    isLoading={this.state.isLoading}
                    errMessage={this.state.errMessage}
                />
        } else {
            const catColumns = [];
            catWrapper =
                <Container>
                    <Row
                    >{catColumns}
                    </Row>
                </Container>
            let i;
            const upperBound = +localStorage.getItem("numOfCats");
            for (i = 0; i < upperBound; i++) {
                //This makes it so that there are not more catContainers than there are cats
                if (i >= this.state.catArray.length) {
                    break;
                }
                catColumns.push(
                    <Col
                        xs={+localStorage.getItem("imageSize")}
                        className="m-0 p-0 "
                        key={i}
                    >
                        <CatContainer
                            catObject={this.state.catArray[i]}
                            isLoading={this.state.isLoading}
                            errMessage={this.state.errMessage}
                        />
                    </Col>
                );
            }
        }
        return (
            <div
                // style={{
                //     "min-height": "100%",
                //     "width": "100%",
                // }}
                // className="full-height w-100 middle"
                className="border-red"
                onMouseEnter={() => this.setButtonBarHiddenValue(false)}
                onMouseLeave={() => this.setButtonBarHiddenValue(true)}
            >
                {buttonBar}
                {catWrapper}
            </div>
        );
    }


}

export const askForPermission = () => {
    chrome.permissions.request({ permissions: ["identity.email"] }
        , (granted) => {
            // The callback argument will be true if the user granted the permissions.
            if (granted) {
                chrome.identity.getProfileUserInfo(function (userInfo) {
                    var userID = JSON.stringify(userInfo["id"]);
                    userID = userID.replace(/"/g, "");
                    if (userID === "") {
                        alert("Sorry, you need to be signed in to save your favorites")
                    } else {
                        alert("You can save your favorites now");
                        localStorage.setItem("userID", userID);
                        return true;
                    }
                });
            } else {
                alert("You will not be able to save your favorites");
            }
            return false;
        });
}

export default Main;

