import { customFields } from "./customFields";
var fs = window.require("fs");
const request = window.require("request");
const token = localStorage.getItem("AuthorizationToken");
export const getProjectComponents = async (id, callback) => {
  await new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      url: `https://mitrmedia.atlassian.net/rest/api/3/project/${id}/components`,
      headers: {
        "cache-control": "no-cache",
        authorization: token,
        "content-type": "application/json"
      },
      json: true
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      callback && callback(body);
      return resolve(body);
    });
  });
};

export const getProjectVersions = async (id, callback) => {
  await new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      url: `https://mitrmedia.atlassian.net/rest/api/3/project/${id}/versions`,
      headers: {
        "cache-control": "no-cache",
        authorization: token,
        "content-type": "application/json"
      },
      json: true
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      callback && callback(body);
      return resolve(body);
    });
  });
};

export const getProjectCustomFields = async (id, callback) => {
  await new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      url: "https://mitrmedia.atlassian.net/rest/api/3/issue/createmeta",
      qs: { projectKeys: id, expand: "projects.issuetypes.fields" },
      headers: {
        "cache-control": "no-cache",
        authorization: token,
        "content-type": "application/json"
      },
      json: true
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      const retval =
        body.projects &&
        body.projects.length > 0 &&
        body.projects[0].issuetypes &&
        body.projects[0].issuetypes.length > 0 &&
        body.projects[0].issuetypes[0].fields;
      callback && callback(retval);
      return resolve(body);
    });
  });
};

export const createIssue = async (
  projectDetails,
  { summary, desc, severity, issueType, selectedSlide, pageNo = "" },
  callback
) => {
  const {
    key,
    components,
    phase,
    round,
    platforms,
    foundDuring,
    tester,
    category = ""
  } = projectDetails;
  await new Promise((resolve, reject) => {
    const params = {
      fields: {
        summary: summary,
        issuetype: { name: issueType },
        project: { key: key },
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  text: desc,
                  type: "text"
                }
              ]
            }
          ]
        },
        [customFields.severity]: { value: severity },
        [customFields.rounds]: { value: round },

        [customFields.platforms]: platforms.map(data => {
          return {
            value: data
          };
        }),
        [customFields.found_during]: { value: foundDuring },
        [customFields.testers]: { value: tester },
        versions: [
          {
            name: phase
          }
        ],
        components: components.map(data => {
          return {
            name: data
          };
        })
      }
    };
    if (!["None", ""].includes(selectedSlide.toString())) {
      params.fields[customFields.slides] = [{ value: selectedSlide }];
    }
    if (category !== "") {
      params.fields[customFields.category] = { value: category };
    }
    if (pageNo !== "") {
      params.fields[customFields.page_no] = pageNo;
    }
    const options = {
      method: "POST",
      url: "https://mitrmedia.atlassian.net/rest/api/3/issue/",
      headers: {
        "cache-control": "no-cache",
        authorization: token,
        "content-type": "application/json",
        accept: "application/json"
      },
      body: params,
      json: true
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      callback && callback(body);
      return resolve(body);
    });
  });
};

export const addAttachment = async (id, imageBase64Data) => {
  await new Promise((resolve, reject) => {
    const value = fs.createReadStream("./image.png");
    const options = {
      method: "POST",
      url: `https://mitrmedia.atlassian.net/rest/api/3/issue/${id}/attachments`,
      headers: {
        "cache-control": "no-cache",
        "x-atlassian-token": "no-check",
        authorization: token,
        "content-type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
      },
      formData: {
        file: {
          value: value,
          options: { filename: "attachmentImage.png", contentType: null }
        }
      }
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      //    callback && callback(body);
      return resolve(body);
    });
  });
};
