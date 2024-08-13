const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const multer = require("multer");
const MongoStore = require("connect-mongo");
const multiparty = require("connect-multiparty");
const session = require("express-session");
const helmet = require("helmet");
const cloudinary = require("cloudinary").v2;

const app = express();

const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize());

const xss = require("xss-clean");
app.use(xss());

app.use(
  session({
    secret: "SECRET_KEY_KEY_KEY.99999999",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/mentorship",
      collectionName: "userSessions",
    }),
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 90 * 60 * 1000,
    },
  })
);

// CORS policy
const corsPolicy = {
  origin: "https://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsPolicy));

// Read SSL certificate files
const options = {
  key: fs.readFileSync("./certi/mycert.key"),
  cert: fs.readFileSync("./certi/mycert.pem"),
};

// Create an HTTPS server
const server = https.createServer(options, app);

// Serve static files
app.use(express.static("public"));

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
const connectDB = require("./services/db");
connectDB();

// Use JSON parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.disable("x-powered-by");

app.use("/api/mentee", require("./routes/menteeRoutes"));
app.use("/api/mentor", require("./routes/mentorRoutes"));
app.use("/api/session", require("./routes/sessionRoutes"));
app.use("/api/article", require("./routes/articleRoutes"));
app.use("/api/captcha", require("./routes/captchaRoutes"));
app.use("/api", require("./routes/userSessionsRoutes"));
app.use("/api/menteeLogs", require("./routes/menteeLogsRoute"));
app.use("/api/mentorLogs", require("./routes/mentorLogRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
