import express from "express";
import { protect } from "../middleware/auth.js";
import Lead from "../models/Lead.js";
import Client from "../models/Client.js";
import User from "../models/User.js";

const router = express.Router();

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
router.get("/", protect, async (req, res) => {
    try {
        const leadsCount = await Lead.countDocuments();
        const clientsCount = await Client.countDocuments();
        const usersCount = await User.countDocuments();

        res.status(200).json({
            leads: leadsCount,
            clients: clientsCount,
            users: usersCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
