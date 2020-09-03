import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import CatContainer from "./CatContainer";
import ButtonBar from "./ButtonBar";
import API from "./API";
import askForPermission from "./askForPermission";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VelocityTransitionGroup } from "velocity-react";

function Main() {
    //Variables controlled by buttons and saved in local storage
    const [isSingleCat, setIsSingleCat] = useLocalStorage("isSingleCat", true);
    const [isFaveCat, setIsFaveCat] = useLocalStorage("isFaveCat", true);
    const [numOfCats, setNumOfCats] = useLocalStorage("numOfCats", 15);
    const [imageSize, setImageSize] = useLocalStorage("imageSize", 4);
    //State variables
    const [buttonBarIsHidden, setButtonBarIsHidden] = useState(true);
    const [catArray, setCatArray] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [errMessage, setErrMessage] = useState(null);

    function useLocalStorage(key, defaultValue) {
        const [storedValue, setStoredValue] = useState(() => {
            if (localStorage.getItem(key)) {
                //Handles parsing
                if (localStorage.getItem(key) === "true") {
                    return true
                } else if (localStorage.getItem(key) === "false") {
                    return false;
                } else {
                    //In this app, the only options are booleans or integers so this handles the integer case
                    return + localStorage.getItem(key)
                }
            } else {
                return defaultValue;
            }
        });

        const setValue = value => {
            // Handle case where value is a function
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            localStorage.setItem(key, valueToStore);

        };

        return [storedValue, setValue];
    }

    function handleChange(event) {
        const input = event.target;
        const value = input.type === "checkbox" ? input.checked : input.value;
        const name = input.name;

        if (name === "isSingleCat") {
            setIsSingleCat(value);
        } else if (name === "isFaveCat") {
            setIsFaveCat(value);
        } else if (name === "numOfCats") {
            setNumOfCats(value);
        } else if (name === "imageSize") {
            setImageSize(value);
        }
    }

    function getRandomsButton() {
        window.location.reload(false);
        getRandoms();
    }
    const getFavesButton = () => {
        window.location.reload(false);
        getFaves();
    }

    const getRandoms = () => {
        setIsFaveCat(false);
        setCatArray([]);
        setisLoading(true);
        setErrMessage(null);

        API.get("images/search?limit=100")
            .then(res => {
                console.log(res.data)
                setCatArray(res.data);
                setisLoading(false);
                setErrMessage(null);
            })
            .catch(err => {
                setErrMessage("Error fetching cat images");
                console.log(err)
                setCatArray([]);
                console.log(err)
                setisLoading(false);
                console.log(err)
            });
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
                    if (unshuffledArray && unshuffledArray.length) {
                        setCatArray(shuffleArray(unshuffledArray.slice()));
                        setisLoading(false);
                        setErrMessage(null);
                    } else {
                        setErrMessage("You don't have any favorites to display!");
                        setCatArray([]);
                        setisLoading(false);
                    }
                    return unshuffledArray
                }
            })
            .catch(err => {
                setErrMessage("Error fetching cat images");
                setCatArray([]);
                setisLoading(false);
                return err;
            });
    }

    const shuffleArray = array => {
        //This shuffles an array and only sends back one that is the size of 100 or the original array, whichever is smaller
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

    const getFaves = () => {
        if (!localStorage.getItem("userID") && !askForPermission()) {
            console.log("no userID")
            return;
        }
        setIsFaveCat(true);

        setCatArray([]);
        setisLoading(true);
        setErrMessage(null);

        recursiveGetFaves();
    }

    useEffect(() => {
        if (isFaveCat) {
            getFaves();
        } else {
            getRandoms();
        }
    }, [])

    let catWrapper;
    if (isLoading) {
        catWrapper = 
        <div
            className="loadererrorContainer h-100"
        >
            <FontAwesomeIcon
                icon={faCircleNotch}
                className="fa-spin loading"
            />
        </div>
    } else if (errMessage) {
        const errMessage = "error here"
        catWrapper =
            <div className="loadererrorContainer h-100">
                <h1 className="text-center errMessage">
                    {errMessage}
                </h1>
            </div>

    } else if (isSingleCat) {
        catWrapper = 
            <CatContainer
                catObject={catArray[0]}
                isSingleCat={isSingleCat}
            />
    } else {
        const catCols = [];
        catWrapper =
            <Row
                className="m-0 px-4 flex-fill justify-content-center align-content-center"
            >
                {catCols}
            </Row>
        const upperBound = numOfCats;
        let i;
        for (i = 0; i < upperBound; i++) {
            //This makes it so that there are not more catContainers than there are cats which would break the app
            if (i >= catArray.length) {
                break;
            }
            catCols.push(
                <Col
                    xs={imageSize}
                    key={i}
                    className="p-2"
                >
                    <CatContainer
                        catObject={catArray[i]}
                        isSingleCat={isSingleCat}
                    />
                </Col>
            );
        }
    }

    return (
        <div
            className="m-0 p-0 w-100 h-100 d-flex flex-column"
            onMouseEnter={() => setButtonBarIsHidden(false)}
            onMouseLeave={() => setButtonBarIsHidden(true)}
        >
            <VelocityTransitionGroup enter={{ animation: "slideDown" }} leave={{ animation: "slideUp" }}>
                {buttonBarIsHidden ? null :
                    <ButtonBar
                        getFavesButton={getFavesButton}
                        getRandomsButton={getRandomsButton}
                        handleChange={handleChange}
                        isSingleCat={isSingleCat}
                        numOfCats={numOfCats}
                        imageSize={imageSize}
                    />
}
            </VelocityTransitionGroup>

            {catWrapper}
        </div>
    );
}


export default Main;

