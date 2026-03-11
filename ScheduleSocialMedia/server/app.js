const express = require("express");
const cors = require("cors");
const app = express();

const authrouter = require("./controllers/authController");
const userRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatController");
const messageRouter = require("./controllers/messageController");
const scheduleRouter = require("./controllers/scheduleController");

const server = require("http").createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://cs35l-group-project.onrender.com",
];

const io = require("socket.io")(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authrouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/schedule", scheduleRouter);

io.on("connection", (socket) => {
  socket.on("join-room", (userid) => {
    socket.join(userid);
  });

  socket.on("send-message", (message) => {
    io.to(message.members[0]).to(message.members[1]).emit("receive-message", message);
  });

  socket.on("clear-unread-messages", (data) => {
    io.to(data.members[0]).to(data.members[1]).emit("message-count-cleared", data);
  });
});

module.exports = server;