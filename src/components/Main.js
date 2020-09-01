import React, { useEffect, useState } from "react";
import { Row, Container, Col } from "reactstrap";
import CatContainer from "./CatContainer";
import ButtonBar from "./ButtonBar";
import TransitionWrapper from "./TransitionWrapper";
import API from "./API";
import askForPermission from "./askForPermission";

function Main() {
    const [buttonBarIsHidden, setButtonBarIsHidden] = useState(true);
    const [catArray, setCatArray] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [errMessage, setErrMessage] = useState(null);

    const handleChange = event => {
        const input = event.target;
        const value = input.type === "checkbox" ? input.checked : input.value;
        const name = input.name;
        localStorage.setItem(name, value);

        //todo: make it reload when the nuOfcats changes or else you get loaders
        //possibly just append to catList? that way they get to keep the cats they are already looking at
    }

    const getRandomsButton = () => {
        window.location.reload(false);
        getRandoms();
    }
    const getFavesButton = () => {
        window.location.reload(false);
        getFaves();
    }

    const getRandoms = () => {
        localStorage.setItem("isFaveCat", false);
        let limit = 1;
        if (localStorage.getItem("isSingleCat") === "false") {
            limit = +localStorage.getItem("numOfCats")
        }
        API.get(`images/search?limit=${limit}`)
            .then(res => {
                console.log(res.data)
                setCatArray(shuffleArray(res.data));
                setisLoading(false);
                setErrMessage(null);
            })
            .catch(err => {
                //todo: handle err
                console.log(err)
                setCatArray([]);
                setisLoading(false);
                setErrMessage("Error fetching this cat image");
            })
    }

    const recursiveGetFaves = (pageCount = 0, cats = []) => {
        API.get(`favourites`, {
            "params": {
                "page": pageCount,
                "sub_id": localStorage.getItem("userID")
            }
        })
            .then(res => {
                if (res && res.data && res.data.length) {
                    recursiveGetFaves(pageCount + 1, cats.concat(res.data))
                } else {
                    const unshuffledArray = cats.map((item) => {
                        const temp = item["image"];
                        temp["faveID"] = item.id;
                        return temp;
                    });
                    setCatArray(shuffleArray(unshuffledArray.slice()));
                    setisLoading(false);
                    setErrMessage(null);
                    return unshuffledArray
                }
            })
            .catch(err => {
                //todo: handle err
                console.log(err)
                setCatArray([]);
                setisLoading(false);
                setErrMessage("Error fetching this cat image");
                return err;
            })
    }

    const shuffleArray = array => {
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

    const getFaves = () => {
        if (!localStorage.getItem("userID") && !askForPermission()) {
            console.log("no userID")
            return;
        }
        localStorage.setItem("isFaveCat", true);
        recursiveGetFaves();
    }



    useEffect(() => {
        //Setting initial options so they don't have to be checked every time
        if (!localStorage.getItem("isFaveCat")) {
            localStorage.setItem("isFaveCat", false)
        }
        if (!localStorage.getItem("isSingleCat")) {
            localStorage.setItem("isSingleCat", true)
        }
        if (!localStorage.getItem("numOfCats")) {
            localStorage.setItem("numOfCats", 15)
        }
        if (!localStorage.getItem("imageSize")) {
            localStorage.setItem("imageSize", 4)
        }
        if (localStorage.getItem("isFaveCat") === "true") {
            getFaves();
        } else {
            getRandoms();
        }
    }, [])

    let catWrapper;
    if (!catArray.length && !errMessage && !isLoading) {
        //todo: fix this css too
        catWrapper =
            <div className="full-height justify-content-center d-flex align-items-center">
                <h1 className="text-center noFaves">
                    You don't have any favorites to display!
                    </h1>
            </div>

    } else {
        const catColumns = [];
        catWrapper =
            <Container>
                <Row
                >{catColumns}
                </Row>
            </Container>
        let i;
        let upperBound = +localStorage.getItem("numOfCats");
        if (localStorage.getItem("isSingleCat") === "true"){
            upperBound = 1;
        }
        for (i = 0; i < upperBound; i++) {
            //This makes it so that there are not more catContainers than there are cats
            if (i >= catArray.length) {
                break;
            }
            catColumns.push(
                <Col
                    xs={(localStorage.getItem("isSingleCat") === "true") ? 12 : +localStorage.getItem("imageSize")}
                    className="m-0 p-0 "
                    key={i}
                >
                    <CatContainer
                        catObject={catArray[i]}
                        isLoading={isLoading}
                        errMessage={errMessage}
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
            onMouseEnter={() => setButtonBarIsHidden(false)}
            onMouseLeave={() => setButtonBarIsHidden(true)}
        >
            <TransitionWrapper>
                {buttonBarIsHidden ? null :
                    <ButtonBar
                        getFavesButton={getFavesButton}
                        getRandomsButton={getRandomsButton}
                        handleChange={handleChange}
                    />
                }
            </TransitionWrapper>
            {catWrapper}
        </div>
    );
}

export default Main;

