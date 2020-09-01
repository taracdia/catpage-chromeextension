import React, { useState } from "react";
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, CardImg } from "reactstrap";
import API from "./API"
import askForPermission from "./askForPermission";
import { VelocityTransitionGroup } from "velocity-react";

function CatContainer(props) {
    const [buttonIsHidden, setButtonIsHidden] = useState(true);
    const [errMessage, setErrMessage] = useState(null);
    //If displaying favorites, isFave is defaulted to true and if not, false
    const [isFave, setIsFave] = useState((localStorage.getItem("isFaveCat") === "true"));

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

    const deleteFave = () => {
        API.delete(`favourites/${props.catObject.faveID}`)
            .then(res => {
                if (res.ok) {
                    delete props.catObject.faveID;
                    setIsFave(false);
                }
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
        <div
            // style={{
            //     "min-height": "100%",
            //     "width": "100%",
            // }}
            className="flex-fill border-red"
        >
            <Card
                onMouseEnter={() => setButtonIsHidden(false)}
                onMouseLeave={() => setButtonIsHidden(true)}
                className="full-height cat-card middle border-red"
            >
                <VelocityTransitionGroup enter={{ animation: "slideDown" }} leave={{ animation: "slideUp" }}>

                    {buttonIsHidden ? null :
                        <div>
                            <Button
                                onClick={handleButtonClick}
                                className="btn btn-danger faveButton"
                            >
                                <FontAwesomeIcon
                                    icon={isFave
                                        ? faHeartFilled : faHeartEmpty} />
                            </Button>
                        </div>
                    }
                </VelocityTransitionGroup>
                <CardImg
                    width="100%"
                    src={props.catObject.url}
                    alt="Cat"
                    className="full-height"
                />
            </Card>
        </div>
    )
}

export default CatContainer;