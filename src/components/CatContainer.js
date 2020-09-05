import React, { useState, useEffect } from "react";
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "reactstrap";
import API from "./API"
import askForPermission from "./askForPermission";
import { VelocityTransitionGroup } from "velocity-react";
import useResizeAware from "react-resize-aware";

function CatContainer(props) {
    const [buttonIsHidden, setButtonIsHidden] = useState(true);
    const [errMessage, setErrMessage] = useState(null);
    const [height, setHeight] = useState(100);
    const [isFave, setIsFave] = useState(props.isFaveCat);
    const [resizeListener, sizes] = useResizeAware();
    useEffect(() => {
        //This is so that when the user switches between modes and the contents of the catContainer update, the heart full/empty defaults to whichever is appropriate for the new mode
        setIsFave(props.isFaveCat)
    }, [props.isFaveCat])

    const handleButtonClick = () => {
        setErrMessage(null);
        if (localStorage.getItem("userID")) {
            if (props.catObject.faveID) {
                deleteFave();
            } else {
                postFave();
            }
        } else {
            askForPermission();
        }
    }

    useEffect(() => {
        //This keeps the catContainers square for aesthetic reasons and gets rid of the need to come up with a height for every variation in screen size and number of cats
        if (sizes.width - height > 5 || height - sizes.width > 5) {
            setHeight(sizes.width)
        }
    }, [sizes.width, sizes.height, height])

    const deleteFave = () => {
        API.delete(`favourites/${props.catObject.faveID}`)
            .then(() => {
                delete props.catObject.faveID;
                setIsFave(false);
                localStorage.setItem("numOfFaves", +localStorage.getItem("numOfFaves") - 1)
            })
            .catch(() => {
                setErrMessage("Error deleting favorite")
            })
    }

    function postFave() {
        if (!localStorage.getItem("userID") && !props.askForPermission()) {
            return;
        }

        API.post("favourites", {
            image_id: props.catObject.id,
            sub_id: localStorage.getItem("userID")
        })
            .then(res => {
                props.catObject.faveID = res.data.id;
                setIsFave(true)
                if (localStorage.getItem("numOfFaves")) {
                    localStorage.setItem("numOfFaves", +localStorage.getItem("numOfFaves") + 1)
                } else {
                    localStorage.setItem("numOfFaves", 1)
                }
            })
            .catch(error => {
                //This means that this image was already a favorite
                //Handle this by searching all the favorites and changing the appropriate settings
                if (error.response.status === 400) {
                    const upperBound = Math.ceil(localStorage.getItem("numOfFaves") / 100);
                    let i;
                    for (i = 0; i <= upperBound; i++) {
                        API.get("favourites", {
                            "params": {
                                "page": i,
                                "sub_id": localStorage.getItem("userID")
                            }
                        }).then(res => {
                            const array = res.data.filter(item => item.image_id === props.catObject.id);
                            if (array.length) {
                                props.catObject.faveID = array[0].id;
                                setIsFave(true)
                                return;
                            }
                        })
                    }
                } else {
                    setErrMessage("Error adding favorite")
                }
            })
    }

    if (errMessage) {
        return (
            <div>
                {errMessage}
            </div>
        )
    }

    return (
        //Styles are to make the catContainer be a perfect square for aesthetic purposes
        <div
            style={{
                position: "relative",
                height: height + "px",
                backgroundImage: `url(${props.catObject.url})`
            }}
            className={`flex-fill catContainer ${props.isSingleCat ? "" : "transparentBackground"}`}
            onMouseEnter={() => setButtonIsHidden(false)}
            onMouseLeave={() => setButtonIsHidden(true)}
        >
            {resizeListener}
            <VelocityTransitionGroup enter={{ animation: "slideDown" }} leave={{ animation: "slideUp" }}>

                {buttonIsHidden ? null :
                    <Button
                        onClick={handleButtonClick}
                        className="btn btn-danger faveButton"
                    >
                        <FontAwesomeIcon
                            icon={isFave
                                ? faHeartFilled : faHeartEmpty} />
                    </Button>
                }
            </VelocityTransitionGroup>
        </div>
    );
}

export default CatContainer;