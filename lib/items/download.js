// download.js
const got = import("got");
const userPathGenerator = require("../helpers/pathHelper");
const gotConfig = require("../helpers/gotHelper");

/**
 * @function download
 * @description Download item content
 *
 * @param {Object} params
 * @param {String} params.accessToken OneDrive access token
 * @param {String} params.itemId item id
 * @param {String} params.format converts item to specified format
 *
 * @return {ReadableStream} Readable stream with item's content
 */
async function download(params) {
  if (!params.accessToken) {
    throw new Error("Missing params.accessToken");
  }

  if (!params.itemId) {
    throw new Error("Missing params.itemId");
  }

  const userPath = userPathGenerator(params);
  const URI = appConfig.apiUrl + userPath + "items/" + params.itemId + "/content" + (params.format ? `?format=${params.format}` : "");

  const gotExtend = (await got).got.extend({
    hooks: {
      beforeRequest: gotConfig.beforeRequestHookGot(params.accessToken),
    },
    isStream: true,
    method: "GET",
  });
  return gotExtend.stream(URI);
}

module.exports = download;
