const vscode = require("vscode");
const { accessTokenKey, refreshTokenKey } = require("./constants");

export class Util {
  static globalState;

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
