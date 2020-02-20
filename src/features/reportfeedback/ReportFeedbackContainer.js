import React, { Component } from "react";

import StylePage, { StyledButton } from "app/common/component/StylePage";
import { AvForm } from "availity-reactstrap-validation";
import { Button } from "reactstrap";
import { Header } from "app/common/component/Header";
const fs = window.require("fs");
const shell = window.require("electron").shell;
class ReportFeedbackContainer extends Component {
  componentDidMount() {}
  render() {
    const { issueDetails } = this.props.history;
    return (
      <StylePage Header={<Header h2={"Thank you "} outerBoxPadding={"0px"} />}>
        <AvForm>
          <div style={{ fontSize: "15px" }}>
            <p style={{ fontWeight: "bold" }}>
              The issue has been logged in jira
            </p>
            <p>
              if you wish to change something in ticket, please click below
              link.
            </p>
            <p>
              {issueDetails && (
                <Button
                  style={{
                    fontSize: "15px",
                    background: "none",
                    border: "0",
                    color: "blue",
                    textDecoration: "underline"
                  }}
                  onClick={() =>
                    shell.openExternal(
                      "https://mitrmedia.atlassian.net/browse/" +
                        issueDetails.key
                    )
                  }
                >
                  {issueDetails.key}
                </Button>
              )}
            </p>
          </div>
          <StyledButton
            onClick={() => {
              const path = "./image.png";
              //
              fs.existsSync(path) &&
                fs.unlink(path, err => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                });
              this.props.onBackPage();
            }}
            name={"Report Another Issue"}
          />
        </AvForm>
      </StylePage>
    );
  }
}

export default ReportFeedbackContainer;
