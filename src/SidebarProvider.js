const { authenticateUser } = require("./extension.js");
const vscode = require("vscode");
const getNonce = require("./getNonce.js");
const { accessTokenKey, apiBaseUrl, refreshTokenKey } = require("./constants.js");

module.exports = class SidebarProvider {
  constructor(_extensionUri) {
    this._extensionUri = _extensionUri;
  }

  resolveWebviewView(webviewView, _context) {
    this._view = webviewView;
    this._context = _context;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "onAuthenticate": {
          authenticateUser(data.value);
          break;
        }
      }
    });
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

    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src ${apiBaseUrl.includes("https")
        ? apiBaseUrl.replace("https", "wss")
        : apiBaseUrl.replace("http", "ws")
      } ${apiBaseUrl} https://x9lecdo5aj.execute-api.us-east-1.amazonaws.com; img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource
      }; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleResetUri}" rel="stylesheet">
                <link href="${stylesheetUri}" rel="stylesheet">
                <link href="${scriptUri}" rel="stylesheet">
                <script nonce="${nonce}">
                  const tsvscode = acquireVsCodeApi();
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