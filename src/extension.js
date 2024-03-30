const vscode = require('vscode');
// import { getNonce } from './src/getNonce';
var SidebarProvider = require("./SidebarProvider");
var authenticate = require("./authenticate");
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const sidebarProvider = new SidebarProvider(context.extensionUri);
    context.subscriptions.push(
		context.subscriptions.push(vscode.window.registerWebviewViewProvider('vshunch-sidebar-view', sidebarProvider))
	);

    // context.subscriptions.push(vscode.commands.registerCommand('extension.login', () => {
    //     vscode.window.showInformationMessage('Login clicked!');
    // }));

	context.subscriptions.push(
		vscode.commands.registerCommand("vshunch.authenticate", () => {
			console.log("sex")
		vscode.window.showInformationMessage('Hello World from VSHunch!');
		  authenticate(() => {});
		})
	  );
	

	console.log('Congratulations, your extension "vshunch" is now active!');
	

	// let disposable = vscode.commands.registerCommand('vshunch.helloWorld', function () {
		
	// 	vscode.window.showInformationMessage('Hello World from VSHunch!');
	// });

	// context.subscriptions.push(disposable);
}

function authenticateUser(url) {
	vscode.window.showInformationMessage('Hello World from VSHunch!');
}

function deactivate() {}

module.exports = {
	activate,
	deactivate,
	authenticateUser
}
