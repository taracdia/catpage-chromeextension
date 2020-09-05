import React from "react";
import { Row, Col, Form, Label, Input, FormGroup } from "reactstrap";

function ButtonBar(props) {
        return (
            <Form
                className="text-center align-items-center transparentBackground"
            >
                <Row form
                    className="align-items-center m-auto w-75"
                >
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="checkbox"
                                    checked={props.isSingleCat}
                                    onChange={props.handleChange}
                                    name="isSingleCat"
                                />
          Only One Cat Displayed
        </Label>
                        </FormGroup>
                    </Col>
                    <Col hidden={props.isSingleCat}>
                        <FormGroup>
                            <Label for="catsNumberInput">
                                Number of Cats to Display
                                </Label>
                            <Input type="number" name="numOfCats" min="1"
                                max="100" value={props.numOfCats}
                                onChange={props.handleChange}
                                id="catsNumberInput" />
                        </FormGroup>
                    </Col>
                    <Col
                        xs="col-auto"
                    >
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={props.getFaves}
                        >
                            {props.isSingleCat ? "Get Fave" : "Get Faves"}
                        </button>
                    </Col>
                    <Col
                        xs="col-auto"
                        className="m-2">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={props.getRandoms}
                        >
                            {props.isSingleCat
                                ? "Get New Cat" : "Get New Cats"}
                        </button>
                    </Col>
                    <Col hidden={props.isSingleCat}>
                        <Input type="range" name="imageSize" id="imageSizeSlider"
                            min="1" max="12" value={props.imageSize}
                            onChange={props.handleChange} />
                        <Label for="imageSizeSlider">Image size</Label>
                    </Col>
                </Row>
            </Form>

        );
    
}

export default ButtonBar;