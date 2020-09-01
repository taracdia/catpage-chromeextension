import React, { useState } from "react";
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, CardImg } from "reactstrap";
import TransitionWrapper from "./TransitionWrapper";
import API from "./API"
import askForPermission from "./askForPermission";


function CatContainer(props) {
    const [buttonIsHidden, setButtonIsHidden] = useState(true);
    const [isFave, setIsFave] = useState((localStorage.getItem("isFaveCat") === "true"));

    const handleButtonClick = () => {
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
                console.log(res)
                delete props.catObject.faveID;
                setIsFave(false);
            })
            .catch(err => {
                //todo: handle
                console.log(err)
            })
    }

    const postFave = () => {
        if (!localStorage.getItem("userID") && !props.askForPermission()) {
            return;
        }

        const postBody = {
            image_id: props.catObject.id,
            sub_id: localStorage.getItem("userID")
        }
        API.post('favourites', postBody)
            .then(res => {
                console.log(res.data.id)
                props.catObject.faveID = res.data.id;
                setIsFave(true)
            })
            .catch(error => {
                console.log(error)
            })
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
                    <TransitionWrapper

                    >
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
                    </TransitionWrapper>
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