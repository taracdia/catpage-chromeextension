import React from "react";
import { Button, Row, Col, Container, Form, Label, Input, FormGroup } from "reactstrap";
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSingleCat: localStorage.getItem("isSingleCat") === "true",

            isFaveCat: localStorage.getItem("isFaveCat") === "true",

            numOfCats:
                (localStorage.getItem("numOfCats") !== null)
                    ? localStorage.getItem("numOfCats")
                    : 13,
            imageSize:
                (localStorage.getItem("imageSize") !== null)
                    ? localStorage.getItem("imageSize")
                    : 4,
            isLoggedIn:
                (localStorage.getItem("userID") !== null)
        }
    }

    handleChange = event => {
        const input = event.target;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        const name = input.name;

        this.setState({ [name]: value });
        localStorage.setItem(name, value);
    };

    getFaveCats = () => {
        this.setState({ "isFaveCat": true });
        localStorage.setItem("isFaveCat", true);
        console.log("fave")
    }

    getRandomCats = () => {
        this.setState({ "isFaveCat": false });
        localStorage.setItem("isFaveCat", false);
        console.log(localStorage.getItem("userID"))
    }

    render() {
        const catContainers = [];
        let i;
        const upperBound = (this.state.isSingleCat) ? 1 : this.state.numOfCats;
        for (i = upperBound; i > 0; i--) {
            catContainers.push(
                <CatContainer
                    key={i}
                    isSingleCat={this.state.isSingleCat}
                    catImage=".\logo192.png"
                    imageSize={this.state.imageSize}
                    isLoggedIn={this.state.isLoggedIn}
                />
            );
        }

        return (
            <Container className="border">
                <ButtonBar
                    className="border"
                    isSingleCat={this.state.isSingleCat}
                    imageSize={this.state.imageSize}
                    numOfCats={this.state.numOfCats}
                    isLoggedIn={this.state.isLoggedIn}
                    getFaveCats={this.getFaveCats}
                    getRandomCats={this.getRandomCats}
                    handleChange={this.handleChange}
                />
                <Row>
                    {catContainers}
                </Row>
            </Container>
        );
    }
}

class CatContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alreadyInFaves: false
        }
    }

    addOrDel = () => {
        if (this.state.alreadyInFaves) {
        } else {
        }
        this.setState({ alreadyInFaves: !this.state.alreadyInFaves })
    }

    render() {
        //todo: add in font-awesome to have empty and filled heart
        return (
            //todo: have singleCat take up entire page
            <Col xs={(this.props.isSingleCat) ? 12 : this.props.imageSize} className="m-0 p-0">
                {/* will have different text depending on whether or not the cat image is already in the user's favorites */}
                <Button
                    hidden={!this.props.isLoggedIn}
                    onClick={this.addOrDel}
                    className="btn btn-danger"
                >
                    <FontAwesomeIcon icon={this.state.alreadyInFaves ? faHeartFilled : faHeartEmpty} />
                </Button>
                <img className="border w-100" src={this.props.catImage} alt="cat" />
            </Col>
        );
    }
}

class ButtonBar extends React.Component {
    //todo: transition when mouse over whole page
    render() {
        return (
            <Form className="text-center">
                <Row form className="align-items-center">
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="checkbox"
                                    checked={this.props.isSingleCat}
                                    onChange={this.props.handleChange}
                                    name="isSingleCat"
                                />
          Only One Cat Displayed
        </Label>
                        </FormGroup>
                    </Col>
                    <Col hidden={this.props.isSingleCat}>
                        <FormGroup>
                            <Label for="catsNumberInput">Number of Cats to Display</Label>
                            <Input type="number" name="numOfCats" min="1" max="100" value={this.props.numOfCats} onChange={this.props.handleChange} id="catsNumberInput" />
                        </FormGroup>
                    </Col>
                    <Col
                        disabled={!this.props.isLoggedIn}
                        xs="col-auto">
                        <Button onClick={this.props.getFaveCats}>
                            {(this.props.isSingleCat) ? "Get Fave" : "Get Faves"}
                        </Button>
                    </Col>
                    <Col
                        xs="col-auto"
                        className="m-2">
                        <Button onClick={this.props.getRandomCats}>
                            {(this.props.isSingleCat) ? "Get New Cat" : "Get New Cats"}
                        </Button>
                    </Col>
                    <Col hidden={this.props.isSingleCat}>
                        <Input type="range" name="imageSize" id="imageSizeSlider" min="1" max="12" value={this.props.imageSize}
                            onChange={this.props.handleChange} />
                        <Label for="imageSizeSlider">Image size</Label>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Main;