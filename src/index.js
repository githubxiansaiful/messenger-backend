import express from "express";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.route.js";
import messageRoute from "../routes/message.route.js";
import { connectDB } from "../lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5174", // or use your frontend URL in production
    credentials: true,
}));

// Test route to check if backend is working
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Your API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute);

// Connect to DB
connectDB();

// For Vercel, export the app to be handled as a serverless function
export default app;
