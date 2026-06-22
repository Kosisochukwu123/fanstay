require("dotenv").config();
console.log("CLIENT_URL:", process.env.CLIENT_URL);
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
const initSocket = require("./services/socketService");

const PORT = process.env.PORT || 5001;

connectDB();

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  },
});

initSocket(io);

server.listen(PORT, () => {
  console.log(
    `FanStay API server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`,
  );
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
});
