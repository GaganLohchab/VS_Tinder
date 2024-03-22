// export const _prod_ = process.env.NODE_ENV === "production";
// export const apiBaseUrl = _prod_
//   ? "https://api.vsinder.com"
//   : "http://localhost:3001";
// export const accessTokenKey = "@vsinder/token" + (_prod_ ? "" : "dev");
// export const refreshTokenKey = "@vsinder/refresh-token" + (_prod_ ? "" : "dev");

// In a file named config.js
const _prod_ = process.env.NODE_ENV === "production";
const apiBaseUrl = _prod_ ? "https://api.vsinder.com" : "http://localhost:3001";
const accessTokenKey = "@vshunch/token" + (_prod_ ? "" : "dev");
const refreshTokenKey = "@vshunch/refresh-token" + (_prod_ ? "" : "dev");

module.exports = {
  _prod_,
  apiBaseUrl,
  accessTokenKey,
  refreshTokenKey
};