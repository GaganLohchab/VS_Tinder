const vscode = acquireVsCodeApi();

const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=1141eb58b9ab1fc3ae89&redirect_uri=http://localhost:3001/auth/github/callback&scope=user&state=random_string`;

const loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", () => {
  
  vscode.postMessage({
    command: "login",
  });

  // Open a new window for GitHub authentication
  const authWindow = window.open(
    githubAuthUrl,
    "_blank",
    "width=600,height=600"
  );

  if (!authWindow) {
    vscode.postMessage({
      command: "showMessage",
      text: "Unable to open the authentication window. Please check your popup settings and try again.",
    });
    return;
  }

  // Listen for changes in the authentication window's URL
  const interval = setInterval(() => {
    try {
      // Check if the authentication window has navigated to a new URL
      if (authWindow.location.href !== githubAuthUrl) {
        clearInterval(interval);
        authWindow.close();
        vscode.postMessage({
          command: "showMessage",
          text: "Login successful",
        });
      }
    } catch (e) {
      // This will catch errors when trying to access the URL of the authWindow
      if (authWindow.closed) {
        clearInterval(interval);
        vscode.postMessage({
          command: "showMessage",
          text: "Login failed",
        });
      }
    }
  }, 1000);
});

// const vscode = acquireVsCodeApi(); // Removed duplicate declaration

// // Corrected the usage of template literals for the URL
// const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=1141eb58b9ab1fc3ae89&redirect_uri=http://localhost:3001/auth/github/callback&scope=user&state=random_string`;

// const loginButton = document.getElementById("loginButton");
// loginButton.addEventListener("click", () => {
//   vscode.postMessage({
//     command: "login",
//   });

//   // Open a new window for GitHub authentication
//   const authWindow = window.open(
//     githubAuthUrl,
//     "_blank",
//     "width=600,height=600"
//   );

//   // Listen for changes in the authentication window's URL
//   const interval = setInterval(() => {
//     if (authWindow.closed) {
//       clearInterval(interval); // Stop checking once the window is closed
//       vscode.postMessage({
//         command: "showMessage",
//         text: "Login failed",
//       });
//     }
//     // Removed the incorrect condition that was never true
//   }, 1000);
// });


// // const vscode = require("vscode");

// // // const vscode = acquireVsCodeApi();

