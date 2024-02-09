
const vscode = require('vscode');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	
	console.log('Congratulations, your extension "vstinder" is now active!');


	let disposable = vscode.commands.registerCommand('vstinder.helloWorld', function () {
		
		vscode.window.showInformationMessage('Hello World from VS Tinder!');
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
