
const vscode = require('vscode');
import { authenticate } from "./src/authenticate";
import { languageIdMap } from "./languageIdMap";
import { SidebarProvider } from "./SidebarProvider";
import { SnippetStatus } from "./SnippetStatus";
import { Util } from "./src/Util";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  Util.globalState = context.globalState;
  SnippetStatus.createSnippetStatus();
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vsinder-sidebar",
      sidebarProvider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vsinder.authenticate", () => {
      authenticate(() => {});
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vsinder.reloadSidebar", async () => {
      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.vsinder-sidebar-view"
      );
      setTimeout(() => {
        vscode.commands.executeCommand(
          "workbench.action.webview.openDeveloperTools"
        );
      }, 500);
      // SwiperPanel.kill();
      // SwiperPanel.createOrShow(context.extensionUri);
      // if (sidebarProvider._view) {
      //   sidebarProvider.resolveWebviewView(sidebarProvider._view);
      // }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vsinder.addCodeToProfile", async () => {
      const { activeTextEditor } = vscode.window;
      if (!activeTextEditor) {
        vscode.window.showErrorMessage("I don't see any code");
        return;
      }
      let text = activeTextEditor.document.getText(activeTextEditor.selection);
      if (!text) {
        text = activeTextEditor.document.getText();
      }

      if (!text) {
        vscode.window.showErrorMessage(`I couldn't get any code`);
        return;
      }

      if (text.length > 600) {
        text = text.slice(0, 600);
        vscode.window.showWarningMessage(
          `Only taking the first 600 characters`
        );
      }
      const languageId = activeTextEditor.document.languageId;

      await vscode.commands.executeCommand(
        "workbench.view.extension.vsinder-sidebar-view"
      );
      sidebarProvider._view?.webview.postMessage({
        command: "new-code-snippet",
        data: {
          code: text,
          language:
            languageId in languageIdMap
              ? languageIdMap[languageId as keyof typeof languageIdMap]
              : "auto",
          // theme: "vscode",
          fontFamily: "Fira Code",
          // theme: '' // @todo infer theme
        },
      });
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}




// import SidebarProvider  from "./sidebar/SidebarProvider";


/**
//ram {vscode.ExtensionContext} context
 */
// function activate(context) {

	// Create an instance of SidebarProvider
  //   const sidebarProvider = new SidebarProvider(context);

	// Register a command to create and show the sidebar
  //   const disposable = vscode.commands.registerCommand('extension.showSidebar', () => {
  // 	  sidebarProvider.createSidebar();
  //   });

	// Add the command to the context subscriptions
  //   context.subscriptions.push(disposable);


  // const sidebarProvider = new SidebarProvider(context.extensionUri);
  // context.subscriptions.push(
  // 	vscode.window.registerWebviewViewProvider(
  // 		"myextension-sidebar",
  // 		sidebarProvider
  // 	)
  // );

  
//   console.log('Congratulations, your extension "vstinder" is now active!');


//   let disposable = vscode.commands.registerCommand('vstinder.helloWorld', function () {
	  
// 	  vscode.window.showInformationMessage('Hello World from VS Tinder!');
//   });

//   context.subscriptions.push(disposable);
// }

// function deactivate() {}

// module.exports = {
//   activate,
//   deactivate
// }


// "main": "./extension.js",
//   "contributes": {
//     "commands": [{
//       "command": "extension.showSidebar",
//       "onView": "sidebarview",
//       "title": "Hello World"
//     }],

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below