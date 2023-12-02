const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Serve the React app (assuming your React app is in a folder named 'client')
app.use(express.static("client/dist"));

const users = new Map();

// WebSocket logic
io.on("connection", (socket) => {
  console.log("A user connected");

  // Generate a unique user ID
  const userId = socket.id;

  // Store user information
  users.set(socket.id, {
    id: userId,
    color: getRandomColor(),
  });

  socket.emit("chat message", {
    sender: "system",
    text: `Welcome! Your ID is ${userId}`,
  });

  socket.broadcast.emit("chat message", {
    sender: "system",
    text: `User ${userId} joined the chat`,
  });

  // Handle chat messages
  socket.on("chat message", (msg) => {
    // Emit the message with sender information
    io.emit("chat message", {
      sender: users.get(socket.id).id,
      text: msg,
      color: users.get(socket.id).color,
    });
  });

  socket.on("typing", () => {
    // Broadcast a typing alert to others
    socket.broadcast.emit("typing", {
      sender: users.get(socket.id).id,
    });
  });

  socket.on("stop typing", () => {
    // Broadcast a stop typing alert to others
    socket.broadcast.emit("stop typing", {
      sender: users.get(socket.id).id,
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // Broadcast a user left message to others
    socket.broadcast.emit("chat message", {
      sender: "system",
      text: `User ${userId} left the chat`,
    });
    users.delete(socket.id);

    console.log("User disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
