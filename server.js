const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store the text input from users
let sharedText = "";

// WebSocket server
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    // Append the message to the shared text
    sharedText += message + "\n";
  });

  // Send the current shared text to the newly connected client
  ws.send(sharedText);
});

// Serve the HTML and client-side JavaScript
app.use(express.static("public"));

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
