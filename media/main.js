const vscode = require('vscode');

const vscode = acquireVsCodeApi();
const loginButton = document.getElementById('loginButton');
const githubAuthUrl = 'https://github.com/login/oauth/authorize?client_id=1141eb58b9ab1fc3ae89&redirect_uri=http://localhost:3001/auth/github/callback/callback&scope=user&state=random_string'; 
// Replace with your GitHub authentication URL

loginButton.addEventListener('click', () => {
    // Post a message to the VS Code extension to initiate the authentication process
    vscode.postMessage({
        command: 'login'
    });
    
    // Open a new browser window to the GitHub authentication URL
    const authWindow = window.open(githubAuthUrl, '_blank', 'width=600,height=600');

    // Listen for changes in the authentication window's URL
    const interval = setInterval(() => {
        if (authWindow.closed) {
            clearInterval(interval); // Stop checking once the window is closed
        } else if (authWindow.closed && authWindow.location.href === githubAuthUrl) {
            // If the authentication window was closed without any redirection (no authentication)
            vscode.postMessage({
                command: 'showMessage',
                text: 'Login failed'
            });
        }
    }, 1000); // Check every second for changes in the window's URL
});

                
// const vscode = acquireVsCodeApi();

//                     const loginButton = document.getElementById('loginButton');
//                     loginButton.addEventListener('click', () => {
//                         vscode.postMessage({
//                             command: 'login'
//                         });
//                     })