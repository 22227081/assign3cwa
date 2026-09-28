const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");

dotenv.config();

require("./db");

const capsuleRoutes = require("./routes/capsules");
const authRoutes = require("./routes/auth");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/api/capsules", capsuleRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

// Serve React production build
const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

// React SPA fallback
app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});