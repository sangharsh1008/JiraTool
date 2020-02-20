import React, { Component } from "react";
import { Input } from "reactstrap";
import "./screenShotStyles.css";
import StylePage, { StyledButton } from "app/common/component/StylePage";
import { AvForm } from "availity-reactstrap-validation";
import { Header } from "app/common/component/Header";
import "../../App.css";
import { createIssue, addAttachment } from "../../utils/issueUtils";
import ReportFeedbackContainer from "../reportfeedback/ReportFeedbackContainer";

const fs = window.require("fs");
const path = "./image.png";
class CreateIssueContainer extends Component {
  state = {
    severity: "",
    issueType: "",
    summary: "",
    desc: "",
    isSubmit: false,
    ticketID: "",
    isShowScreenShotPage: false,
    pageNo: "",
    selectedSlide: "",
    isShowFeedBackPage: false
  };

  onSubmitIssue = img => {
    const {
      severity,
      issueType,
      summary,
      desc,
      imgSrc,
      selectedSlide,
      pageNo
    } = this.state;
    if (img === imgSrc) this.setState({ imgSrc: imgSrc });
    this.setState({ isSubmit: true });

    if (
      severity !== "" &&
      issueType !== "" &&
      summary !== "" &&
      desc !== "" &&
      (selectedSlide !== "" || pageNo !== "")
    ) {
      const path = "./image.png";
      createIssue(
        this.props.history.projectDetails,
        { summary, desc, severity, issueType, selectedSlide, pageNo },
        issueDetails => {
          const path = "./image.png";

          fs.existsSync(path) &&
            addAttachment(issueDetails.key, this.props.imageBase64Data);
          Object.assign(this.props.history, {
            issueDetails: issueDetails
          });

          this.props.setScreenShotImage("");
          this.setState({
            isShowFeedBackPage: true
          });
        }
      );
    }
  };

  showSummaryPage = () => {
    const {
      severityArray,
      slideNos,
      page_no
    } = this.props.history.projectDetails;
    const {
      severity,
      issueType,
      summary,
      desc,
      isSubmit,
      pageNo,
      selectedSlide
    } = this.state;

    return (
      <StylePage Header={<Header h2={"Creating Issue"} />}>
        <AvForm>
          <div style={{ fontSize: "10px" }}>
            {summary === "" && isSubmit && (
              <span className="issue-alert">Please enter summary</span>
            )}
            <Input
              type="text"
              name="text"
              id="exampleText"
              placeholder="Summary"
              onChange={e =>
                this.setState({
                  summary: e.target.value
                })
              }
            />
            {desc === "" && isSubmit && (
              <span className="issue-alert">Please select description</span>
            )}
            <Input
              type="textarea"
              placeholder="Description"
              name="text"
              id="exampleTextAria"
              onChange={e =>
                this.setState({
                  desc: e.target.value
                })
              }
            />

            {page_no && (
              <React.Fragment>
                <span className="issue-alert">
                  {pageNo === "" && isSubmit && "Please enter page number"}
                </span>

                <Input
                  type="textarea"
                  placeholder="Page no."
                  name="text"
                  id="exampleText"
                  onChange={e =>
                    this.setState({
                      pageNo: e.target.value
                    })
                  }
                />
              </React.Fragment>
            )}
            <div className="optionWrapper">
              <div style={{ width: "100%", marginRight: "5px" }}>
                {severity === "" && isSubmit && (
                  <span className="issue-alert">Please select description</span>
                )}
                <select
                  className="drop-report-issue"
                  onChange={e => this.setState({ severity: e.target.value })}
                >
                  <option value="" disabled selected hidden>
                    Severity
                  </option>
                  {severityArray &&
                    severityArray.map((val, index) => (
                      <option id={index} key={index}>
                        {val}
                      </option>
                    ))}
                </select>
              </div>
              {!page_no && (
                <div style={{ width: "100%", marginRight: "5px" }}>
                  {selectedSlide === "" && isSubmit && (
                    <span className="issue-alert">Please select Slide Nos</span>
                  )}
                  <select
                    className="drop-report-issue"
                    onChange={e =>
                      this.setState({ selectedSlide: e.target.value })
                    }
                  >
                    <option value="" disabled selected hidden>
                      Slide Nos.
                    </option>
                    <option id={-1} key={-1} value="None">
                      {"None"}
                    </option>
                    {slideNos &&
                      slideNos.map((val, index) => (
                        <option id={index} key={index}>
                          {val}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div style={{ width: "100%", marginLeft: "5px" }}>
                {issueType === "" && isSubmit && (
                  <span className="issue-alert">Please select description</span>
                )}
                <select
                  className="drop-report-issue"
                  onChange={e => this.setState({ issueType: e.target.value })}
                >
                  <option value="" disabled selected hidden>
                    Issue Type
                  </option>
                  {["Bug", "Improvement"].map((val, index) => (
                    <option key={index} id={index}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {fs.existsSync(path) && (
            <div
              style={{
                backgroundColor: "#f5f5f5",
                border: "1px solid transparent",
                fontWeight: "normal",
                width: "100%",
                marginBottom: "5px",
                textAlign: "left",
                color: "grey"
              }}
            >
              <span> {"image.png"}</span>
              <button
                style={{
                  float: "right",
                  border: "0",
                  background: "border-box"
                }}
                onClick={() => {
                  const path = "./image.png";
                  fs.existsSync(path) &&
                    fs.unlink(path, err => {
                      if (err) {
                        return;
                      }
                    });

                  this.props.setScreenShotImage("");
                }}
              >
                <i
                  style={{ color: "palevioletred" }}
                  class="glyphicon glyphicon-trash"
                ></i>
              </button>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px"
            }}
          >
            <StyledButton
              style={{ marginRight: "20px" }}
              name=" Take Snapshot"
              id="submit"
              type="submit"
              onClick={() => {
                this.props.toggleScreenShotPage();
              }}
            />
            <StyledButton
              style={{ marginLeft: "20px" }}
              name="Create Issue"
              id="submit"
              type="submit"
              onClick={this.onSubmitIssue}
            />
          </div>
        </AvForm>
        <div
          style={{
            textDecoration: "underline",
            color: "blue",
            fontSize: "12px",
            marginTop: "23px",
            float: "left",
            cursor: "pointer"
          }}
          onClick={() => {
            this.props.onPageBack();
          }}
        >
          {" "}
          {"  <- Back to Project Info"}
        </div>
      </StylePage>
    );
  };

  render() {
    const { isShowFeedBackPage } = this.state;
    console.log("sangharsh");
    if (isShowFeedBackPage) {
      return (
        <ReportFeedbackContainer
          history={this.props.history}
          onBackPage={() => {
            this.setState({
              isShowFeedBackPage: false
            });
          }}
        />
      );
    } else {
      return this.showSummaryPage();
    }
  }
}

export default CreateIssueContainer;
