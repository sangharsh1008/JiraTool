import React, { Component } from "react";
//import { validateLogin } from "../../gateway/login";
import { Button } from "reactstrap";

import { Container, Jumbotron, Card, CardBody } from "reactstrap";

import "bootstrap/dist/css/bootstrap.min.css";

class StylePage extends Component {
  render() {
    const outerBoxPadding = this.props.outerBoxPadding;
    return (
      <Container
        style={{
          width: "335px",
          justifyContent: "center",
          padding: outerBoxPadding
        }}
      >
        {this.props.subHeading && (
          <div>
            {" "}
            <h4>
              <u
                style={{
                  color: "black",
                  textDecoration: "unset",
                  fontSize: "22px",
                  fontWeight: "bold"
                }}
              >
                {this.props.subHeading}
              </u>
            </h4>
          </div>
        )}
        <Jumbotron
          style={{ width: "98%", height: "98%", marginBottom: "0px" }}
        >
          {this.props.Header}
          <Card
            style={{ color: "black", fontWeight: "normal", fontSize: "13px" }}
          >
            <CardBody>{this.props.children}</CardBody>
          </Card>
        </Jumbotron>
      </Container>
    );
  }
}

export const StyledButton = props => {
  return (
    <Button
      id="submit"
      onClick={props.onClick}
      style={{
        ...props.style,
        backgroundColor: "#0062cc",
        fontSize: "12px"
      }}
    >
      {props.name}
    </Button>
  );
};

export default StylePage;
