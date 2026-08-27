import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
    .get(protect, authorize("Admin", "Manager"), getDashboardStats);

export default router;
