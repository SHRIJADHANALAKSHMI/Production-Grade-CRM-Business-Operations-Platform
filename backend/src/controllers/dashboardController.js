import Lead from "../models/Lead.js";
import Client from "../models/Client.js";

export const getDashboardStats = async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments();
        const totalClients = await Client.countDocuments();
        const convertedLeads = await Lead.countDocuments({ status: "converted" });

        res.status(200).json({
            success: true,
            message: "Dashboard stats retrieved",
            data: {
                totalLeads,
                totalClients,
                convertedLeadsCount: convertedLeads
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};
