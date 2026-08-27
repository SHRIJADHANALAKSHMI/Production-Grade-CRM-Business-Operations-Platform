import express from "express";
import { getActivities } from "../controllers/activityController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getActivities); // Fetch global activities

export default router;
