import React from "react";
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, CardImg, Col, Row, Container } from "reactstrap";
import TransitionWrapper from "./TransitionWrapper";

class CatContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alreadyInFaves: this.props.isFaveCat,
            buttonIsHidden: true,
            faveId: null
            //todo: pass faveId
        }
    }

    addOrDel = () => {
        
        const callback = () => this.setState({ alreadyInFaves: !this.state.alreadyInFaves });
        if (this.state.alreadyInFaves) {
            //todo: remove faveId
        } else {
            //todo: store faveId
        }

    }

    handleButtonClick = () => {
        if (localStorage.getItem("userID") === null) {
            // this.props.askForPermission(this.addOrDel);
        } else {
            this.addOrDel();
        }
    }

    changeButtonHidden = val => {
        this.setState({ buttonIsHidden: val })
    }

    render() {
        if (this.props.errMessage) {
            return (<div className="error">
                {this.props.errMessage}
            </div>)
        }else if (!this.props.catObject) {
            return (
                <div
                    className="loaderContainer"
                >
                    <FontAwesomeIcon
                        icon={faCircleNotch}
                        className="fa-spin loading"
                    />
                </div>
            )
        }

        return (
            // <Container
            // className="border-red"
            // style={{
            //     "min-height": "100%",
            //     "width": "100%",
            // }}
            // >
            //     <Row>
            //         <Col>
                    
            <div
            style={{
                "min-height": "100%",
                "width": "100%",
            }}
            className="flex-fill border-red"
            >
            <Card
                onMouseEnter={() => this.changeButtonHidden(false)}
                onMouseLeave={() => this.changeButtonHidden(true)}
                className="full-height cat-card middle border-red"
            >
                <TransitionWrapper

                >
                    {this.state.buttonIsHidden ? null :
                        <div>
                            <Button
                                onClick={this.handleButtonClick}
                                className="btn btn-danger faveButton"
                            >
                                <FontAwesomeIcon
                                    icon={this.state.alreadyInFaves
                                        ? faHeartFilled : faHeartEmpty} />
                            </Button>
                        </div>
                    }
                </TransitionWrapper>
                <CardImg
                width="100%"
                src={this.props.catObject.url}
                alt="Cat"
                className="full-height"
                 />
            </Card>
            </div>
            // </Col>
            //     </Row>
            // </Container>
        )
    }
}

export default CatContainer;