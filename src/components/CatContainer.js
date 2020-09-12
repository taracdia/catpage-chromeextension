import React, { useState, useEffect } from "react";
import { faHeart as faHeartFilled }
    from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty }
    from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon }
    from "@fortawesome/react-fontawesome";
import { Button } from "reactstrap";
import API from "./API"
import askForPermission from "./askForPermission";
import { VelocityTransitionGroup } from "velocity-react";
import useResizeAware from "react-resize-aware";

function CatContainer(props) {
    const [buttonIsHidden, setButtonIsHidden] =
        useState(true);
    const [errMessage, setErrMessage] = useState(null);
    const [height, setHeight] = useState(100);
    const [isFave, setIsFave] = useState(props.isFaveCat);
    const [resizeListener, sizes] = useResizeAware();
    useEffect(() => {
        /*
        This is so that when the user switches between 
        modes and the contents of the catContainer update, 
        the heart full/empty defaults to whichever is 
        appropriate for the new mode. It's necessary to 
        have the variable isFave because if everything was 
        based on whether
        */
        setIsFave(props.isFaveCat)
    }, [props.isFaveCat])

    const handleButtonClick = () => {
        setErrMessage(null);
        /*
        Checking whether there is a saved userID, which 
        means that permission has been granted and the user 
        ID can be accessed
        */
        if (localStorage.getItem("userID")) {
            if (isFave) {
                deleteFave();
            } else {
                postFave();
            }
        } else {
            /*
            If not, request permission and save their userID
            */
            askForPermission();
        }
    }

    useEffect(() => {
        /*
        This keeps the catContainers square for aesthetic 
        reasons and gets rid of the need to come up with a 
        height for every variation in screen size and 
        number of cats
        */
        if (sizes.width - height > 5 ||
            height - sizes.width > 5) {
            setHeight(sizes.width);
        }
    }, [sizes.width, sizes.height, height]);

    const deleteFave = () => {
        /*
        No need to check for permission because if there 
        are favorites to display then they must have 
        already given permission
        */
        API.delete(`favourites/${props.catObject.faveID}`)
            .then(() => {
                setIsFave(false);
                localStorage.setItem("numOfFaves",
                    +localStorage.getItem("numOfFaves") - 1)
            })
            .catch(() => {
                setErrMessage("Error deleting favorite");
            });
    }

    function postFave() {
        /*
        If there is no username request it. If the request 
        is denied, exit the function early. Else continue
        */
        if (!localStorage.getItem("userID") &&
            !props.askForPermission()) {
            return;
        }

        API.post("favourites", {
            image_id: props.catObject.id,
            sub_id: localStorage.getItem("userID")
        })
            .then(res => {
                /*
                Save the returned favorite ID so that it 
                can be accessed in the deleteFave function
                */
                props.catObject.faveID = res.data.id;
                setIsFave(true);
                /*
                Create or increment the value stored 
                in "numOfFaves"
                */
                if (localStorage.getItem("numOfFaves")) {
                    localStorage.setItem("numOfFaves",
                        +localStorage.getItem("numOfFaves")
                        + 1);
                } else {
                    localStorage.setItem("numOfFaves", 1);
                }
            })
            .catch(error => {
                /*
                This means that this image was already a 
                favorite. Handle this by searching all the 
                favorites for the favoriteID
                */
                if (error.response.status === 400) {
                    /*
                    Here is where the variable numOfFaves 
                    is useful. Each page is 100 favorites 
                    so the number of pages is the number of 
                    favorites divided by 100
                    */
                    const upperBound = Math.ceil(
                        localStorage.getItem("numOfFaves")
                        / 100);
                    let i;
                    //Get all of the favorites page by page
                    for (i = 0; i <= upperBound; i++) {
                        API.get("favourites", {
                            "params": {
                                "page": i,
                                "sub_id": localStorage.getItem("userID")
                            }
                        }).then(res => {
                            /*
                            For each page of results, if 
                            there is an image that has an 
                            ID that matches the image we 
                            already have, we can assign the 
                            value to the object's faveID 
                            property in case the user 
                            decides to delete it and we can 
                            exit the function
                            */
                            const array = res.data.filter
                                (item => item.image_id ===
                                    props.catObject.id);
                            if (array.length) {
                                props.catObject.faveID =
                                    array[0].id;

                                setIsFave(true);
                                return;
                            }
                        })
                    }
                } else {
                    setErrMessage("Error adding favorite");
                }
            });
    }

    if (errMessage) {
        return (
            <div>
                {errMessage}
            </div>
        )
    }

    return (
        <div
            /*
                Styles are to make the catContainer be a 
                perfect square for aesthetic purposes and 
                to have a dynamic background image
            */
            style={{
                position: "relative",
                height: height + "px",
                backgroundImage:
                    `url(${props.catObject.url})`
            }}
            className={`flex-fill catContainer
            ${props.isSingleCat
                    ? ""
                    : "transparentBackground"}`}
            onMouseEnter={() => setButtonIsHidden(false)}
            onMouseLeave={() => setButtonIsHidden(true)}
        >
            {resizeListener}
            <VelocityTransitionGroup
                enter={{ animation: "slideDown" }}
                leave={{ animation: "slideUp" }}
            >
                {buttonIsHidden ? null :
                    <Button
                        onClick={handleButtonClick}
                        className="btn btn-danger 
                        faveButton"
                    >
                        <FontAwesomeIcon
                            icon={isFave
                                ? faHeartFilled
                                : faHeartEmpty} />
                    </Button>
                }
            </VelocityTransitionGroup>
        </div>
    );
}

export default CatContainer;