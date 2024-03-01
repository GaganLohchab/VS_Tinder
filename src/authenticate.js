// import polka from "polka";
// const vscode = require('vscode');
// import { refreshTokenKey, accessTokenKey, apiBaseUrl } from "./constants.js";
// import { Util } from "./Util.js";
const polka = require("polka");
const vscode = require('vscode');
const { refreshTokenKey, accessTokenKey, apiBaseUrl } = require("./constants.js");
// const constants = require('./constants.js');
const { Util } = require("./Util.js");
const SidebarProvider = require("./SidebarProvider");

// https://github.com/shanalikhan/code-settings-sync/blob/master/src/service/github.oauth.service.ts
const authenticate = (fn) => {
  const app = polka();
  app.listen(54321);
  vscode.commands.executeCommand(
    "vscode.open",
    vscode.Uri.parse(`${apiBaseUrl}/auth/github`)
  );
  app.get("/callback/:accessToken/:refreshToken", async (req, res) => {
    const { accessToken, refreshToken } = req.params;
    if (!accessToken || !refreshToken) {
      res.end(`ext: something went wrong`);
      app.server.close();
      return;
    }

    await Util.globalState.update(accessTokenKey, accessToken);
    await Util.globalState.update(refreshTokenKey, refreshToken);
    fn({ accessToken, refreshToken });

    res.end(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src vscode-resource:; form-action vscode-resource:; frame-ancestors vscode-resource:; img-src vscode-resource: https:; script-src 'self' 'unsafe-inline' vscode-resource:; style-src 'self' 'unsafe-inline' vscode-resource:;"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      </head>
      <body>
          <h1>Success! You may now close this tab.</h1>
          <style>
            html, body {
              background-color: #1a1a1a;
              color: #c3c3c3;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              width: 100%;
              margin: 0;
            }
          </style>
      </body>
    </html>
    `);

    app.server.close();
  });
};

module.exports = authenticate;