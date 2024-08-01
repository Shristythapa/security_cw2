const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const { Server } = require("socket.io");
const { ExpressPeerServer } = require("peer");
const cloudinary = require("cloudinary");
const multiparty = require("connect-multiparty");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
// Read SSL certificate files
const options = {
  key: fs.readFileSync("./certi/mycert.key"),
  cert: fs.readFileSync("./certi/mycert.pem"),
};

// Create an Express application
const app = express();

app.use(cookieParser());

// Create an HTTPS server
const server = https.createServer(options, app);

// CORS policy
const corsPolicy = {
  origin: "https://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsPolicy));

// Create a new Socket.IO server instance
const io = new Server(server, {
  corsPolicy,
});

// Set up PeerJS server
const opinions = { debug: true };
app.use("/peerjs", ExpressPeerServer(server, opinions));

// Serve static files
app.use(express.static("public"));

// Define the room-users map
const roomUsersMap = {};

// Handle Socket.IO connections
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

// Configure Cloudinary
cloudinary.config({
  cloud_name: "duhlo06nb",
  api_key: "617821885829489",
  api_secret: "7hELqPjemOLTQMHygIAsDJmpGME",
});

// Configure multiparty for handling file uploads
app.use(multiparty());

// Load environment variables
dotenv.config();

// Connect to the database
const connectDB = require("./database/db");
connectDB();

// Use JSON parser middleware
app.use(express.json());

// Set up API routes
app.use("/api/mentee", require("./routes/menteeRoutes"));
app.use("/api/mentor", require("./routes/mentorRoutes"));
app.use("/api/session", require("./routes/sessionRoutes"));
app.use("/api/article", require("./routes/articleRoutes"));
app.use("/api/captcha", require("./routes/captchaRoutes"));

app.post("/api/validate-token", (req, res) => {
  const token = req.cookies.cookieHTTP; // Get token from cookie
  console.log(token);
  if (!token) {
    return res.status(401).json({ valid: false });
  }

  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ valid: false });
    }

    console.log(decoded);
    res.json({
      valid: true,
      user: decoded,
    });
  });
});
// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;
