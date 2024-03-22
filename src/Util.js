const vscode = require("vscode");
const { accessTokenKey, refreshTokenKey } = require("./constants.js");

// Assuming that the equivalent functionality is to be achieved without the types and decorators provided by TypeScript

// The import statements need to be converted to require statements or similar depending on the environment
module.exports = class Util {
  constructor() {
    this.globalState = {};
  }
  // static globalState = {}; // Removed the TypeScript type annotation
  // Util.globalState = {};

  static getRefreshToken() {
    return this.globalState.get(refreshTokenKey) || "";
  }

  static getAccessToken() {
    return this.globalState.get(accessTokenKey) || "";
  }

  static isLoggedIn() {
    return (
      !!this.globalState.get(accessTokenKey) &&
      !!this.globalState.get(refreshTokenKey)
    );
  }
}



// module.exports = { Util };