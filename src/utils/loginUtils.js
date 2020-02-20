const request = window.require("request");
export const getProjectData = async (string, callback) => {
  await new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      url: "https://mitrmedia.atlassian.net/rest/api/3/issue/createmeta",
      headers: {
        "cache-control": "no-cache",
        authorization: `Basic ${string}`,
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
