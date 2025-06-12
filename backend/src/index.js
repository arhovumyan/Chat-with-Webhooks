import express from 'express';
import dotenv from 'dotenv';
import http from 'http';                   // ✅ Required
import { Server } from 'socket.io';        // ✅ Required
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoute from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ Create HTTP server

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // ✅ must match your frontend
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/message", messageRoutes);

// ✅ Socket.IO server logic
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`🟢 Socket connected: ${socket.id} (userId: ${userId})`);

  socket.on("disconnect", () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`);
  });
});

// ✅ Start the server with socket support
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  connectDB();
});

