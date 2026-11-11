
const express = require("express");

const app = express();

// Import routes
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");

// Import authentication middleware
const authenticateToken = require("./middleware/auth.middleware");

// Middleware to parse JSON
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "User Management API is running!"
    });
});

// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy"
    });
});

// User CRUD routes
app.use("/api/users", userRoutes);

// Authentication routes
app.use("/api/auth", authRoutes);

// Protected profile route
app.get("/api/profile", authenticateToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Protected profile accessed successfully",
        user: req.user
    });
});

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

module.exports = app;
