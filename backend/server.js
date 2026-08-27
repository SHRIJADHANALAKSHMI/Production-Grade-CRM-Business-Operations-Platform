import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import leadRoutes from "./src/routes/leadRoutes.js";
import clientRoutes from "./src/routes/clientRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import { errorHandler } from "./src/middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

// Secure CORS to specific frontend origin
const corsOptions = {
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Application Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/test", (req, res) => {
    res.status(200).json({ success: true, message: "API is running securely", data: null });
});

// Custom Error Handler wrapper mapping
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Production Server running on port ${PORT}`);
});
