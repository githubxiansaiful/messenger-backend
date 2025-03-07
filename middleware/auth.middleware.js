import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        // Extract token from cookies
        const token = req.cookies?.jwt;

        // Debugging log to verify token presence
        console.log("Token received:", token);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided." });
        }

        // Verify token and handle expiration
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                console.error("Token has expired:", err.message);
                return res.status(401).json({ message: "Unauthorized - Token expired." });
            } else {
                console.error("Invalid token error:", err.message);
                return res.status(401).json({ message: "Unauthorized - Invalid token." });
            }
        }

        // Ensure decoded token contains userId
        if (!decoded?.userId) {
            return res.status(401).json({ message: "Unauthorized - Invalid payload." });
        }

        // Find user and exclude password field
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Attach user to the request object
        req.user = user;

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
