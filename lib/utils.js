import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    // Update the cookie settings to ensure it works in development and production
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,  // Cookie expiry in milliseconds
        httpOnly: true,  // Ensures the cookie can't be accessed via JavaScript
        sameSite: "None",  // Important for cross-origin requests
        secure: process.env.NODE_ENV === "production",  // Only set to true in production (https)
    });

    return token;
};
