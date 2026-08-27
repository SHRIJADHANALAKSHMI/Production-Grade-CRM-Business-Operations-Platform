import Activity from "../models/Activity.js";

// @desc    Get all activities (dashboard)
// @route   GET /api/activities
// @access  Private
export const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .populate("leadId", "name email")
            .populate("clientId", "name")
            .populate("createdBy", "name")
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json({ success: true, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createActivityLog = async (data) => {
    try {
        await Activity.create(data);
    } catch (err) {
        console.error("Failed to create activity log", err);
    }
};
