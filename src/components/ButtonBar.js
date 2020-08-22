import React from "react";
import { Button, Row, Col, Form, Label, Input, FormGroup } from "reactstrap";

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
                        disabled={localStorage.getItem("userID") === null}
                        xs="col-auto">
                        <Button onClick={this.props.getFaveCats}>
                            {(this.props.isSingleCat) ? "Get Fave" : "Get Faves"}
                        </Button>
                    </Col>
                    <Col
                        xs="col-auto"
                        className="m-2">
                        <Button
                            onClick={this.props.getRandomCats}
                        >
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

export default ButtonBar;