const userPathGenerator = require("../helpers/pathHelper");
const got = import("got");
const gotConfig = require("../helpers/gotHelper");
const isQueryStringUrlEncoded = require("../helpers/isQueryStringUrlEncoded");

/**
 * @function listChildren
 * @description List childrens
 *
 * @param {Object} params
 * @param {String} params.accessToken OneDrive access token
 * @param {String} [params.itemId=root] Item id
 * @param {Boolean} [params.shared] A flag to indicated whether this files is owned by the user or shared from another user. If true params.user has to be set.
 * @param {String} [params.user] The user who shared the file. Must be set if params.shared is true.
 * @param {String} [params.query] OData system query options.
 *
 * @return {Promise<Object>} object of children items
 */
async function listChildren(params) {
  if (!params.accessToken) {
    throw new Error("Missing params.accessToken");
  }

  params.query = params.query || "";
  params.itemId = params.itemId === undefined ? "root" : params.itemId;
  const userPath = userPathGenerator(params);

  if (params.query && !isQueryStringUrlEncoded(params.query)) {
    console.warn("Query string (" + params.query + ") doesn't look url encoded. You should url encode query string");
  }
  const URI = appConfig.apiUrl + userPath + "items/" + params.itemId + "/children" + params.query;

  const gotExtend = (await got).got.extend({
    hooks: {
      beforeRequest: gotConfig.beforeRequestHookGot(params.accessToken),
    },
    headers: gotConfig.headerJSON,
    responseType: gotConfig.responseJSON,
    method: "GET",
  });

  const response = await gotExtend(URI);
  return response.body;
}

module.exports = listChildren;
