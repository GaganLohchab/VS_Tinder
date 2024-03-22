const vscode = require("vscode");
// import { getNonce } from './getNonce.js';
const getNonce = require("./getNonce.js");
const { Util } = require("./Util.js");
const { accessTokenKey, apiBaseUrl, refreshTokenKey } = require("./constants.js");

module.exports = class SidebarProvider {
  constructor(_extensionUri) {
    this._extensionUri = _extensionUri;
  }

  // const YOUR_GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize?client_id=1141eb58b9ab1fc3ae89&redirect_uri=http://localhost:3001/auth/github/callback/callback&scope=user&state=random_string";

  resolveWebviewView(webviewView, _context) {
    this._view = webviewView;
    this._context = _context;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  _getHtmlForWebview(webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );
    const stylesheetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    const nonce = getNonce();

    const githubAuthUrl =
      "https://github.com/login/oauth/authorize?client_id=1141eb58b9ab1fc3ae89&redirect_uri=http://localhost:3001/auth/github/callback/callback&scope=user&state=random_string";

    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src ${
                  apiBaseUrl.includes("https")
                    ? apiBaseUrl.replace("https", "wss")
                    : apiBaseUrl.replace("http", "ws")
                } ${apiBaseUrl} https://x9lecdo5aj.execute-api.us-east-1.amazonaws.com; img-src https: data:; style-src 'unsafe-inline' ${
              webview.cspSource
              }; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleResetUri}" rel="stylesheet">
                <link href="${stylesheetUri}" rel="stylesheet">
                <link href="${scriptUri}" rel="stylesheet">
                <script nonce="${nonce}">
                
                <!-- Write your comments here  -->
            
                </script>
                <title>Login</title>
                <style>
                    button {
                        positon: absolute;
                        display: block;
                        width: 90%;
                        margin: 10px auto;
                        padding: 10px 20px;
                        background-color: #007acc;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    h1 {
                        margin-top: 30px;
                        text-align: center;
                        color: #007acc;
                    }
                </style>
            </head>
            <body>
            <h1>Login to VSHunch</h1>
            <button id="loginButton">Login with GitHub to get started</button>
            <script nonce="${nonce}" src="${scriptUri}"></script>
            
            </body>
            </html>
        `;
  }
};


            // const apiBaseUrl = ${JSON.stringify(apiBaseUrl)};
            //     const tsvscode = acquireVsCodeApi();
            //     let accessToken = ${JSON.stringify(Util.getAccessToken())};
            //     let refreshToken = ${JSON.stringify(Util.getRefreshToken())};