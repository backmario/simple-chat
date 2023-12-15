const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const users = new Map();

app.use(express.static("client/dist"));

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// WebSocket logic
io.on("connection", (socket) => {
  console.log("A user connected");
  const userId = socket.id;

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

  socket.on("chat message", (msg) => {
    io.emit("chat message", {
      sender: users.get(socket.id).id,
      text: msg,
      color: users.get(socket.id).color,
    });
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing", {
      sender: users.get(socket.id).id,
    });
  });

  socket.on("stop typing", () => {
    socket.broadcast.emit("stop typing", {
      sender: users.get(socket.id).id,
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("chat message", {
      sender: "system",
      text: `User ${userId} left the chat`,
    });
    users.delete(socket.id);

    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
