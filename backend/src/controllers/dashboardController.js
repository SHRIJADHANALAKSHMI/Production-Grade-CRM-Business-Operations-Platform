import Lead from "../models/Lead.js";
import Client from "../models/Client.js";

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments();
        const totalClients = await Client.countDocuments();
        const convertedLeads = await Lead.countDocuments({ status: "converted" });

        res.status(200).json({
            totalLeads,
            totalClients,
            convertedLeadsCount: convertedLeads
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
