import React from "react";
import { Row, Col, Form, Label, Input, FormGroup, Container } from "reactstrap";

class ButtonBar extends React.Component {
    render() {

        return (
            <div
                id="buttonBar"
            >
                <Container>
                    <Form className="text-center">
                        <Row form className="align-items-center">
                            <Col>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox"
                                            checked={(localStorage.getItem("isSingleCat") === "true")}
                                            onChange={this.props.handleChange}
                                            name="isSingleCat"
                                        />
          Only One Cat Displayed
        </Label>
                                </FormGroup>
                            </Col>
                            <Col hidden={(localStorage.getItem("isSingleCat") === "true")}>
                                <FormGroup>
                                    <Label for="catsNumberInput">Number of Cats to Display</Label>
                                    <Input type="number" name="numOfCats" min="1" max="100" value={localStorage.getItem("numOfCats")} onChange={this.props.handleChange} id="catsNumberInput" />
                                </FormGroup>
                            </Col>
                            <Col
                                xs="col-auto"
                            >
                                <button
                                    type="button"
                                    className="btn btn-primary" onClick={this.props.getFavesButton}
                                >
                                    {(localStorage.getItem("isSingleCat") === "true") ? "Get Fave" : "Get Faves"}
                                </button>
                            </Col>
                            <Col
                                xs="col-auto"
                                className="m-2">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={this.props.getRandomsButton}
                                >
                                    {(localStorage.getItem("isSingleCat") === "true") ? "Get New Cat" : "Get New Cats"}
                                </button>
                            </Col>
                            <Col hidden={(localStorage.getItem("isSingleCat") === "true")}>
                                <Input type="range" name="imageSize" id="imageSizeSlider" min="1" max="12" value={localStorage.getItem("imageSize")}
                                    onChange={this.props.handleChange} />
                                    {/* todo: remove showing the number */}
        <Label for="imageSizeSlider">Image size {localStorage.getItem("imageSize")}</Label>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default ButtonBar;