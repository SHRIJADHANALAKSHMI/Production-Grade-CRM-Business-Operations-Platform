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
import activityRoutes from "./src/routes/activityRoutes.js";
import quoteRoutes from "./src/routes/quoteRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import { errorHandler } from "./src/middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [
            "http://localhost:3001", "http://localhost:5173", "http://localhost:3000"
        ];
        // Allow if origin is whitelisted, or dynamically allow Vercel previews if no strict list provided
        if (!origin || allowedOrigins.includes(origin) || !process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/test", (req, res) => {
    res.status(200).json({ success: true, message: "API is running securely", data: null });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Production Server running on port ${PORT}`);
});
