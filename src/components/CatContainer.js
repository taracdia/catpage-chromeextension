import React, { useState, useEffect } from "react";
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "reactstrap";
import API from "./API"
import askForPermission from "./askForPermission";
import { VelocityTransitionGroup } from "velocity-react";
import useResizeAware from 'react-resize-aware';

function CatContainer(props) {
    const [buttonIsHidden, setButtonIsHidden] = useState(true);
    const [errMessage, setErrMessage] = useState(null);
    const [height, setHeight] = useState(100)
    //If displaying favorites, isFave is defaulted to true and if not, false
    const [isFave, setIsFave] = useState((localStorage.getItem("isFaveCat") === "true"));
    const [resizeListener, sizes] = useResizeAware();


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
        if (sizes.width - height > 5 || height - sizes.width > 5) {
            setHeight(sizes.width)
        }
    }, [sizes.width, sizes.height, height])

    const deleteFave = () => {
        API.delete(`favourites/${props.catObject.faveID}`)
            .then(() => {
                    delete props.catObject.faveID;
                    setIsFave(false);
            })
            .catch(() => {
                setErrMessage("Error deleting favorite")
            })
    }

    function postFave() {
        if (!localStorage.getItem("userID") && !props.askForPermission()) {
            return;
        }

        const postBody = {
            image_id: props.catObject.id,
            sub_id: localStorage.getItem("userID")
        }
        API.post('favourites', postBody)
            .then(res => {
                props.catObject.faveID = res.data.id;
                setIsFave(true)
            })
            .catch(error => {
                if (error.response.status === 400) {
                    //This means that this image was already a favorite
                    recursiveFindFaveID();
                } else {
                    setErrMessage("Error adding favorite")
                }
            })
    }

    function recursiveFindFaveID(pageCount = 0) {
        API.get(`favourites`, {
            "params": {
                "page": pageCount,
                "sub_id": localStorage.getItem("userID")
            }
        })
            .then(res => {
                const array = res.data.filter(item => item.image_id === props.catObject.id);
                if (!array.length) {
                    recursiveFindFaveID(pageCount + 1)
                    return;
                }
                props.catObject.faveID = array[0].id;
                setIsFave(true)
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
                position: 'relative',
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