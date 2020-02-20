import React, { Component } from "react";
import "../../App.css";
import {
  getProjectComponents,
  getProjectVersions,
  getProjectCustomFields
} from "../../utils/issueUtils";
import _ from "lodash";
import StylePage, { StyledButton } from "app/common/component/StylePage";
import { AvForm } from "availity-reactstrap-validation";
import { customFields } from "../../utils/customFields";
import Select from "react-select";
import ScreenShotEditor from "../createissue/component/ScreenShotEditor";
import CreateIssueContainer from "../createissue/CreateIssueContainer";
const fs = window.require("fs");
export default class ReportIssue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: this.props.history.projectList.projects,
      projectName: "",
      components: [],
      componentsArr: [],
      projectPhase: "",
      projectRound: "",
      roundsArr: [],
      platforms: [],
      platformsArr: [],
      foundDuring: "",
      foundDuringArr: [],
      projectTester: "",
      testerArr: [],
      category: "",
      categoryArr: [],
      phasesArr: [],
      isSubmit: false,
      nextPage: false,
      isAttachment: false,
      isShowScreenShotPage: false,
      imageBase64Data: ""
    };
  }

  setScreenShotImage(imageBase64) {
    this.setState({
      imageBase64Data: imageBase64
    });
  }
  resetOptions = projectName => {
    this.setState({
      projectPhase: "",
      projectRound: "",
      platforms: [],
      foundDuring: "",
      projectTester: "",
      category: "",
      isSubmit: false,
      nextPage: false,
      isAttachment: false
    });

    _.find(this.state.projects, pt => {
      if (pt.name === projectName) {
        getProjectComponents(pt.id, projectComponent => {
          projectComponent &&
            projectComponent.length > 0 &&
            this.setState({
              projectName: pt.key,
              components: [],
              componentsArr: projectComponent.map(val => val.name)
            });
        });
        getProjectVersions(pt.id, versionsArr => {
          versionsArr &&
            versionsArr.length > 0 &&
            this.setState({
              phasesArr: versionsArr.map(val => val.name)
            });
        });
        getProjectCustomFields(pt.key, fields => {
          this.severity = this.getDropDownValues(fields[customFields.severity]);
          this.slideNos = this.getDropDownValues(fields[customFields.slides]);
          if (fields[customFields.page_no]) {
            this.page_no = true;
          } else {
            this.page_no = false;
          }
          this.setState({
            categoryArr: this.getDropDownValues(fields[customFields.category]),
            roundsArr: this.getDropDownValues(fields[customFields.rounds]),
            foundDuringArr: this.getDropDownValues(
              fields[customFields.found_during]
            ),
            testerArr: this.getDropDownValues(fields[customFields.testers]),
            platformsArr: this.getDropDownValues(fields[customFields.platforms])
          });
        });
      }
    });
  };

  getDropDownValues = field =>
    field && field.allowedValues && field.allowedValues.map(val => val.value);

  handleProjectChange = event => {
    this.resetOptions(event.target.value);
  };

  handleSubmit = e => {
    const {
      projectName,
      components,
      projectPhase,
      projectRound,
      platforms,
      foundDuring,
      projectTester,
      category
    } = this.state;
    e.preventDefault();
    this.setState({
      isSubmit: true
    });
    if (
      projectName !== "" &&
      components !== [] &&
      projectPhase !== "" &&
      projectRound !== "" &&
      platforms !== [] &&
      foundDuring !== "" &&
      projectTester !== ""
    ) {
      Object.assign(this.props.history, {
        projectDetails: {
          key: projectName,
          components: components,
          phase: projectPhase,
          round: projectRound,
          platforms: platforms,
          foundDuring: foundDuring,
          tester: projectTester,
          category: category,
          severityArray: this.severity,
          slideNos: this.slideNos,
          page_no: this.page_no
        }
      });
      this.setState({
        nextPage: true
      });
    }
  };

  IndicatorSeparator = ({ innerProps }) => {
    const indicatorSeparatorStyle = {
      alignSelf: "stretch",
      backgroundColor: "#5243AA",
      marginBottom: 8,
      marginTop: 8,
      width: 1
    };
    return <span style={indicatorSeparatorStyle} {...innerProps} />;
  };

  renderMultiSelectDropDown = (options, placeholder, stateVar) => {
    const formattedOptions =
      options &&
      options !== [] &&
      options.map(option => {
        return { value: option, label: option };
      });
    return (
      <Select
        closeMenuOnSelect={false}
        components={this.IndicatorSeparator}
        isMulti
        value={
          this.state[stateVar] &&
          this.state[stateVar] !== [] &&
          this.state[stateVar].map(option => {
            return { value: option, label: option };
          })
        }
        options={formattedOptions}
        placeholder={placeholder}
        onChange={(e, fn) => {
          this.setState({
            [stateVar]: e && e !== [] && e.map(val => val.value)
          });
        }}
        // {...(this.state.reset ? { value: [] } : {})}
      />
    );
  };

  onReset = () => {
    this.setState({
      projectName: "",
      components: [],
      projectPhase: "",
      projectRound: "",
      platforms: [],
      foundDuring: "",
      projectTester: "",
      category: "",
      categoryArr: [],
      phasesArr: [],
      isSubmit: false,
      nextPage: false,
      isAttachment: false,
      componentsArr: [],
      roundsArr: [],
      foundDuringArr: [],
      testerArr: [],
      platformsArr: []
    });
  };

  renderReportPageIntro = () => {
    const {
      projects,
      projectName,
      components,
      projectPhase,
      projectRound,
      platforms,
      foundDuring,
      projectTester,
      category,
      isSubmit,
      categoryArr,
      phasesArr,
      componentsArr,
      roundsArr,
      foundDuringArr,
      testerArr,
      platformsArr
    } = this.state;
    return (
      <div className="projectFormWrapper">
        {projectName === "" && isSubmit && (
          <span className="issue-alert">Please select project</span>
        )}
        <select
          onChange={this.handleProjectChange}
          className="drop-report-issue"
        >
          {projectName === "" && (
            <option value="" disabled selected hidden>
              Select Project
            </option>
          )}
          {projects && projects.map(val => <option>{val.name}</option>)}
        </select>
        {components && components.length === 0 && isSubmit && (
          <span className="issue-alert">Please select component/s</span>
        )}
        {this.renderMultiSelectDropDown(
          componentsArr,
          "Select Component/s",
          "components"
        )}
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ width: "50%", marginRight: "5px" }}>
            {projectRound === "" && isSubmit && (
              <span className="issue-alert">Please select round</span>
            )}
            <select
              className="drop-report-issue"
              onChange={e => this.setState({ projectRound: e.target.value })}
            >
              {projectRound === "" && (
                <option value="" disabled selected hidden>
                  Round
                </option>
              )}
              {roundsArr &&
                roundsArr !== [] &&
                roundsArr.map(val => <option>{val}</option>)}
            </select>
          </div>

          <div style={{ width: "50%", marginLeft: "5px" }}>
            {projectPhase === "" && isSubmit && (
              <span className="issue-alert">Please select phase</span>
            )}
            <select
              className="drop-report-issue"
              onChange={e => this.setState({ projectPhase: e.target.value })}
            >
              {projectPhase === "" && (
                <option value="" disabled selected hidden>
                  Phase
                </option>
              )}
              {phasesArr &&
                phasesArr !== [] &&
                phasesArr.map(val => <option>{val}</option>)}
            </select>
          </div>
        </div>

        <span className="issue-alert">
          {category === "" && isSubmit && "Please select category"}
        </span>
        <select
          className="drop-report-issue"
          onChange={e => this.setState({ category: e.target.value })}
        >
          {category === "" && (
            <option value="" disabled selected hidden>
              Category
            </option>
          )}
          {categoryArr &&
            categoryArr !== [] &&
            categoryArr.map(val => <option>{val}</option>)}
        </select>

        {platforms && platforms.length === 0 && isSubmit && (
          <span className="issue-alert">Please select platform/s</span>
        )}
        {this.renderMultiSelectDropDown(
          platformsArr,
          "Select Platform/s",
          "platforms"
        )}

        <span className="issue-alert">
          {foundDuring === "" && isSubmit && "Found During field is empty!"}
        </span>
        <select
          className="drop-report-issue"
          onChange={e => this.setState({ foundDuring: e.target.value })}
        >
          {foundDuring === "" && (
            <option value="" disabled selected hidden>
              Found During
            </option>
          )}
          {foundDuringArr &&
            foundDuringArr !== [] &&
            foundDuringArr.map(val => <option>{val}</option>)}
        </select>

        <span className="issue-alert">
          {projectTester === "" && isSubmit && "Please select tester"}
        </span>
        <select
          className="drop-report-issue"
          onChange={e => this.setState({ projectTester: e.target.value })}
        >
          {projectTester === "" && (
            <option value="" disabled selected hidden>
              Tester Name
            </option>
          )}
          {testerArr &&
            testerArr !== [] &&
            testerArr.map(val => <option>{val}</option>)}
        </select>
        <div
          style={{
            textDecoration: "underline",
            color: "blue",
            fontSize: "12px",
            marginTop: "23px",
            float: "left",
            cursor: "pointer"
          }}
          onClick={this.onReset}
        >
          Reset
        </div>
        <StyledButton
          onClick={this.handleSubmit}
          name="Set Environment"
          style={{ margin: "10px 0 0 0" }}
        />
      </div>
    );
  };
  severity;
  slideNos = [];
  page_no = false;
  toggleScreenShotPage() {
    const { isShowScreenShotPage } = this.state;

    this.setState({
      isShowScreenShotPage: !isShowScreenShotPage
    });
  }
  componentDidMount() {
    const path = "./image.png";
    fs.existsSync(path) &&
      fs.unlink(path, err => {
        if (err) {
          return;
        }
      });
  }
  render() {
    const {
      isAttachment,
      isShowScreenShotPage,
      imageBase64Data,
      nextPage
    } = this.state;
    console.log(imageBase64Data, "imageBase64Data");
    if (!isShowScreenShotPage) {
      window.resizeTo(385, 452);
    }
    return (
      <React.Fragment>
        {isShowScreenShotPage && (
          <ScreenShotEditor
            toggleScreenShotPage={() => {
              this.toggleScreenShotPage();
            }}
            setScreenShotImage={image => {
              this.setScreenShotImage(image);
            }}
            isShowScreenShotPage={isShowScreenShotPage}
          />
        )}
        <div
          style={{
            display: isShowScreenShotPage ? "none" : "block"
          }}
        >
          {this.state.nextPage && (
            <CreateIssueContainer
              isAttachment={isAttachment}
              imageBase64Data={imageBase64Data}
              setIsAttachment={val => {
                this.setState({
                  isAttachment: val
                });
              }}
              history={this.props.history}
              onPageBack={() => {
                this.setState({ nextPage: false });
              }}
              setScreenShotImage={image => this.setScreenShotImage(image)}
              toggleScreenShotPage={() => {
                this.toggleScreenShotPage();
              }}
            />
          )}
          <div style={{ display: nextPage ? "none" : "block" }}>
            <StylePage subHeading="Project Selection" outerBoxPadding={"0px"}>
              <AvForm>{this.renderReportPageIntro()}</AvForm>
            </StylePage>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
