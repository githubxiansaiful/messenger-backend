import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Check if the app is running in a local environment (localhost) or production (live link)
const isDevelopment = process.env.NODE_ENV === "development";

const io = new Server(server, {
    cors: {
        origin: isDevelopment
            ? "http://localhost:5174" // Local frontend URL
            : "https://kitty-chaat.vercel.app", // Live frontend URL
        credentials: true, // Allow cookies to be sent with socket connection
    },
});
 
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// Store online users
const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    // Emit the list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };
