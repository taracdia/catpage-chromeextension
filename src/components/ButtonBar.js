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
                                xs="col-auto"
                            >
                                <button
                                    type="button"
                                    className="btn btn-primary" onClick={this.props.getFaveCats}
                                >
                                    {(this.props.isSingleCat) ? "Get Fave" : "Get Faves"}
                                </button>
                            </Col>
                            <Col
                                xs="col-auto"
                                className="m-2">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={this.props.getRandomCats}
                                >
                                    {(this.props.isSingleCat) ? "Get New Cat" : "Get New Cats"}
                                </button>
                            </Col>
                            <Col hidden={this.props.isSingleCat}>
                                <Input type="range" name="imageSize" id="imageSizeSlider" min="1" max="12" value={this.props.imageSize}
                                    onChange={this.props.handleChange} />
                                    {/* remove showing the number */}
        <Label for="imageSizeSlider">Image size {this.props.imageSize}</Label>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default ButtonBar;