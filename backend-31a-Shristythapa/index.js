const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  },
});

const { ExpressPeerServer } = require("peer");
const opinions = {
  debug: true,
};
app.use("/peerjs", ExpressPeerServer(server, opinions));
app.use(express.static("public"));

const roomUsersMap = {};
io.on("connection", (socket) => {
  console.log("SOCKET INIT");

  socket.on("join-room", (roomId, userId) => {
    if (!roomUsersMap[roomId]) {
      roomUsersMap[roomId] = [userId];
    } else {
      if (roomUsersMap[roomId].includes(userId)) {
        return;
      }
    }

    roomUsersMap[roomId].push(userId);
    socket.join(roomId);
    console.log(userId, "joined room");
    setTimeout(() => {
      socket.broadcast.to(roomId).emit("user-connected", userId);
    }, 1000);
  });

  socket.on("mentor-joined", (ROOM_ID) => {
    console.log(ROOM_ID, "MENTOR JOINED NOTIFICATION");
    io.emit("mentor-join", ROOM_ID);
  });

  socket.on("disconnect", (roomId, userId) => {
    console.log(userId, "disconnected");

    io.to(roomId).emit("user-disconnected", userId);
  });
});

const cloudinary = require("cloudinary");

const multiparty = require("connect-multiparty");

cloudinary.config({
  cloud_name: "duhlo06nb",
  api_key: "617821885829489",
  api_secret: "7hELqPjemOLTQMHygIAsDJmpGME",
});

//cors policy
const corsPolicy = {
  origin: "http://localhost:3000",
  // origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsPolicy));

app.use(multiparty());

dotenv.config();

const connectDB = require("./database/db");

connectDB();

app.use(express.json());

app.use("/api/mentee", require("./routes/menteeRoutes"));

app.use("/api/mentor", require("./routes/mentorRoutes"));

app.use("/api/session", require("./routes/sessionRoutes"));

app.use("/api/article", require("./routes/articleRoutes"));

app.get("/test", (req, res) => {
  res.send("Hello from express server");
});
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;
