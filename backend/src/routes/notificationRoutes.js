import express from "express";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch("/:id/read", protect, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { read: true },
            { new: true }
        );
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch("/read-all", protect, async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
        res.status(200).json({ success: true, message: "All marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
