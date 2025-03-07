import express from "express";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.route.js";
import messageRoute from "../routes/message.route.js";
import { connectDB } from "../lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

// CORS Configuration
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5174"; // Default to localhost if not defined
app.use(cors({
    origin: frontendUrl, // Allow frontend URL to access backend
    credentials: true,    // Allow credentials (cookies) to be sent
}));

// Middleware to parse incoming JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Test route to check if backend is working
app.get("/", (req, res) => {
    res.send("Backend is working!");
});

// Your API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute);

// Connect to DB
connectDB();

// Start server locally or in production
const PORT = process.env.PORT || 5002;
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server is running locally on PORT: ${PORT}`);
    });
}

// Export app for serverless deployment (Vercel)
export default app;
