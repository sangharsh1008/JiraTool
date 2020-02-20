import React from "react";
import "./App.css";
import Login from "./features/login/LoginContainer";
import CreateIssueContainer from "./features/createissue/CreateIssueContainer";
import ReportFeedbackContainer from "./features/reportfeedback/ReportFeedbackContainer";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ScreenShotEditor from "./features/createissue/component/ScreenShotEditor";

import ReportIssue from "./features/reportissue/ReportIssueContainer";
const fs = window.require("fs");
const path = "./image.png";

class App extends React.Component {
  componentWillUnmount() {
    fs.existsSync(path) &&
      fs.unlink(path, err => {
        if (err) {
          return;
        }
      });
  }
  componentDidMount() {
    fs.existsSync(path) &&
      fs.unlink(path, err => {
        if (err) {
          console.error(err);
          return;
        }
      });
  }
  render() {
    return (
      <Router>
        <div className="App" style={{ height: "98%" }}>
          <header className="App-header">
            <Switch>
              <Route exact path="/" component={Login} />
              <Route
                exact
                path="/ScreenShotEditor"
                component={ScreenShotEditor}
              />
              <Route
                exact
                path="/CreateIssue"
                component={CreateIssueContainer}
              />
              <Route exact path="/ReportIssue" component={ReportIssue} />
              <Route
                exact
                path="/ReportFeedback"
                component={ReportFeedbackContainer}
              />
            </Switch>
          </header>
        </div>
      </Router>
    );
  }
}

export default App;
