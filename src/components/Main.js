/* global chrome */
import React from "react";
import { Row, Container, Col } from "reactstrap";
import CatContainer from "./CatContainer";
import ButtonBar from "./ButtonBar";
import TransitionWrapper from "./TransitionWrapper";
import axios from 'axios';


const headers = {
    "content-type": "application/json",
    "x-api-key": "72846d44-a455-4a39-a417-d75ce37cde65"
}

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
            buttonBarIsHidden: true,
            catArray: [],
            loading: false,
            errMessage: null
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

        //todo: make it reload when the nuOfcats changes or else you get loaders
        //possibly just append to catList? that way they get to keep the cats they are already looking at
    }
    locallyStoreAndSetState = (name, value) => {
        this.setState({ [name]: value });
        localStorage.setItem(name, value);
    }

    getCats = isFaveCat => {
        //todo: shuffle array
        this.locallyStoreAndSetState("isFaveCat", isFaveCat);
        const settings = {
            "headers": headers,
            "method": "GET"
        }
        if (localStorage.getItem("userID")) {
            settings.sub_id = localStorage.getItem("userID");
        }
        if (isFaveCat) {
            this.makeRequest("https://api.thecatapi.com/v1/favourites", settings);

        } else {
            //todo: change to ternary
            let url = "https://api.thecatapi.com/v1/images/search?limit=";
            if (this.state.isSingleCat) {
                url += "1";
            } else {
                url += this.state.numOfCats;
            }
            this.makeRequest(url, settings);
        }
    }

    makeRequest = (url, settings) => {
        const inScopeThis = this;
        fetch(url, settings).then(function (response) {
            inScopeThis.setState({
                "loading": true,
                "errMessage": null,
                "catArray": []
            });
            return response.json();
        }).then(function (result) {
            console.log(result);

            let array = result;
            if (result[0]["image"]) {
                //means that this is coming from faveImages
                //todo: shuffle
                //todo: only return as many as asked for
                //todo: is there a limit on how many faves?
                array = result.map(function (item) {
                    // this.deleteFave(item.id);
                    const temp = item["image"];
                    temp["faveID"] = item.id;
                    return temp;
                });
            }

            inScopeThis.setState({
                "loading": false,
                "errMessage": null,
                "catArray": array
            });
        }).catch(error => {
            //todo: check and fix this
            inScopeThis.setState({
                "loading": false,
                "errMessage": error,
                "catArray": []
            });
        })
    }

    setButtonBarHiddenValue = val => {
        this.setState({ "buttonBarIsHidden": val });
    }

    handleErrors = response => {
        if (!response.ok) {
            throw response.statusText;
        }

        return response.json();
    }

    deleteFave = (faveId, callback) => {
        const settings = {
            "headers": headers,
            "method": "DELETE",
            "sub_id": localStorage.getItem("userID")
        }

        const inScopeThis = this;

        fetch("https://api.thecatapi.com/v1/favourites/" + faveId, settings)

            .then(function (response) {
                // console.log(response)
                inScopeThis.handleErrors(response)
            }).then(function (result) {
                // console.log(result)
                //todo: callback to handle turning off heart
                callback();
            })
            .catch(function (error) {
                //   console.log(error)
                inScopeThis.setState({
                    "loading": false,
                    "errMessage": "Error deleting this favorite",
                    "catArray": []
                });
            })

    }

    async favouriteImage(image_id)
            {
                axios.defaults.headers.common['x-api-key'] = "72846d44-a455-4a39-a417-d75ce37cde65"
                try{
                    let post_body = {
                        image_id: image_id,
                        sub_id:"User-123"
                    }
                    let response = await axios.post('https://api.thecatapi.com/v1/favourites', post_body )
                    console.log(response)
                }catch(error){
                    //todo: handle case where  already favorited
                    console.log(error)
                }
            }

    componentDidMount = () => {
        this.getCats(this.state.isFaveCat);
        const imageID = "e3b";
        this.favouriteImage(imageID)
        // const settings = {
        //     "headers": headers,
        //     "method": "POST",
        //     // "sub_id": localStorage.getItem("userID"),
        //     // "image_id": imageID
        // }
        // settings.data = JSON.stringify({
        //     "image_id": imageID,
        //     "sub_id": "localStorage.userID"
        //   });
        // fetch("https://api.thecatapi.com/v1/favourites", settings).then(function (response) {
        //     console.log(response)
        //     return response.json();
        // })
    }




    render() {
        let catWrapper;
        const buttonBar =
            <TransitionWrapper>
                {this.state.buttonBarIsHidden ? null :
                    <ButtonBar
                        isSingleCat={this.state.isSingleCat}
                        imageSize={this.state.imageSize}
                        numOfCats={this.state.numOfCats}
                        getFaveCats={() => this.getCats(true)}
                        getRandomCats={() => this.getCats(false)}
                        handleChange={this.handleChange}
                    />
                }
            </TransitionWrapper>

        if (!this.state.catArray.length && !this.state.loading) {
            //todo: fix this css too
            catWrapper =
                <div className="full-height justify-content-center d-flex align-items-center">
                    <h1 className="text-center noFaves">
                        You don't have any favorites to display!
        </h1>
                </div>

        } else if (this.state.isSingleCat) {
            catWrapper =
                <CatContainer
                    askForPermission={callback => this.askForPermission(callback)}
                    catObject={this.state.catArray[0]}
                    loading={this.state.loading}
                    errMessage={this.state.errMessage}
                    isFaveCat={this.state.isFaveCat}
                    isSingleCat={this.state.isSingleCat}
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
            const upperBound = this.state.numOfCats;
            for (i = 0; i < upperBound; i++) {
                catColumns.push(
                    <Col
                        xs={this.state.imageSize}
                        className="m-0 p-0 "
                        key={i}
                    >
                        <CatContainer
                            askForPermission={callback => this.askForPermission(callback)}
                            catObject={this.state.catArray[i]}
                            loading={this.state.loading}
                            errMessage={this.state.errMessage}
                            isFaveCat={this.state.isFaveCat}
                            isSingleCat={this.state.isSingleCat}

                        />
                    </Col>
                );
            }
        }
        return (
            <div
                style={{
                    "min-height": "100%",
                    "width": "100%",
                }}
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


export default Main;