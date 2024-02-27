const vscode = require("vscode");
const { authenticate } = require("./authenticate.js");
const { accessTokenKey, apiBaseUrl, refreshTokenKey } = require("./constants.js");
// const { FlairProvider } = require("./FlairProvider");
const { getNonce } = require("./getNonce.js");
// const { mutation, mutationNoErr } = require("./mutation");
// const { SnippetStatus } = require("./SnippetStatus");
// const { SwiperPanel } = require("./SwiperPanel");
const { Util } = require("./Util.js");
// const { ViewCodeCardPanel } = require("./ViewCodeCardPanel");

class SidebarProvider {
  constructor(_extensionUri) {
    this._extensionUri = _extensionUri;
  }

  resolveWebviewView(webviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        // case "report":
        //   const message = await vscode.window.showInputBox({
        //     placeHolder: "why are you reporting this user?",
        //   });
        //   if (message) {
        //     await mutationNoErr(`/report`, { message, ...data.value });
        //     webviewView.webview.postMessage({
        //       command: "report-done",
        //       data,
        //     });
        //     vscode.window.showInformationMessage("Thank you for reporting!");
        //   }
        //   break;
        // case "unmatch":
        //   const y = await vscode.window.showInformationMessage(
        //     `Are you sure you want to unmatch "${data.value.userName}"?`,
        //     "Yes",
        //     "No"
        //   );
        //   if (y === "Yes") {
        //     try {
        //       await mutation(`/unmatch`, { userId: data.value.userId });
        //       webviewView.webview.postMessage({
        //         command: "unmatch-done",
        //         payload: {},
        //       });
        //       vscode.window.showInformationMessage(`You unmatched "${data.value.userName}"`);
        //     } catch {}
        //   }
        //   break;
        // case "send-tokens":
        //   webviewView.webview.postMessage({
        //     command: "init-tokens",
        //     payload: {
        //       accessToken: Util.getAccessToken(),
        //       refreshToken: Util.getRefreshToken(),
        //     },
        //   });
        //   break;
        // case "logout":
        //   await Util.globalState.update(accessTokenKey, "");
        //   await Util.globalState.update(refreshTokenKey, "");
        //   SwiperPanel.kill();
        //   ViewCodeCardPanel.kill();
        //   break;
        // case "delete-account":
        //   const y = await vscode.window.showInformationMessage(
        //     "Are you sure you want to delete your account?",
        //     "yes",
        //     "no"
        //   );
        //   if (y === "yes") {
        //     try {
        //       await mutation("/account/delete", {});
        //       await Util.globalState.update(accessTokenKey, "");
        //       await Util.globalState.update(refreshTokenKey, "");
        //       webviewView.webview.postMessage({
        //         command: "account-deleted",
        //         payload: {},
        //       });
        //       vscode.window.showInformationMessage("successfully deleted");
        //       SwiperPanel.kill();
        //       ViewCodeCardPanel.kill();
        //     } catch {}
        //   }
        //   break;
        // case "show-snippet-status":
        //   SnippetStatus.show();
        //   break;
        // case "hide-snippet-status":
        //   SnippetStatus.hide();
        //   break;
        // case "view-code-card":
        //   ViewCodeCardPanel.createOrShow(this._extensionUri, data.value);
        //   break;
        // case "start-swiping":
        //   SwiperPanel.createOrShow(this._extensionUri);
        //   break;
        case "login":
          authenticate((payload) => {
            webviewView.webview.postMessage({
              command: "login-complete",
              payload,
            });
          });
          break;
        case "onInfo":
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        case "onError":
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        case "tokens":
          await Util.globalState.update(accessTokenKey, data.accessToken);
          await Util.globalState.update(refreshTokenKey, data.refreshToken);
          break;
      }
    });
  }

//   ${FlairProvider.getJavascriptMapString()}

  revive(panel) {
    this._view = panel;
  }

  _getHtmlForWebview(webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
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
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
            const apiBaseUrl = ${JSON.stringify(apiBaseUrl)};
            const tsvscode = acquireVsCodeApi();
            let accessToken = ${JSON.stringify(Util.getAccessToken())};
            let refreshToken = ${JSON.stringify(Util.getRefreshToken())};
            <!-- Write your comments here  -->
            
        </script>
			</head>
      <body>
        <div id="root">
        <button>Hello World</button></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}

module.exports = { SidebarProvider };