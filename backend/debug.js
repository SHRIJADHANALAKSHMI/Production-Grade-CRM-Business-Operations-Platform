import Lead from "../models/Lead.js";
import Client from "../models/Client.js";
import Activity from "../models/Activity.js";
import Project from "../models/Project.js";

// Named getDashboardStats to match existing route import
export const getDashboardStats = async (req, res) => {
    
        const totalLeads = await Lead.countDocuments({ deletedAt: null });
        const convertedLeads = await Lead.countDocuments({ status: "converted", deletedAt: null });
        const totalClients = await Client.countDocuments();

        const totalProjects = await Project.countDocuments();

        const conversionRate = totalLeads === 0 ? 0 : ((convertedLeads / totalLeads) * 100).toFixed(1);

        // Flat countDocuments — avoids aggregation pipeline failures
        const leadsByStatus = {
            new: await Lead.countDocuments({ status: "new" }),
            contacted: await Lead.countDocuments({ status: "contacted" }),
            interested: await Lead.countDocuments({ status: "interested" }),
            converted: convertedLeads,
        };

        // Stage breakdown
        const stageBreakdown = [
            { stage: "new", count: await Lead.countDocuments({ stage: "new" }) },
            { stage: "contacted", count: await Lead.countDocuments({ stage: "contacted" }) },
            { stage: "interested", count: await Lead.countDocuments({ stage: "interested" }) },
            { stage: "proposal", count: await Lead.countDocuments({ stage: "proposal" }) },
            { stage: "won", count: await Lead.countDocuments({ stage: "won" }) },
            { stage: "lost", count: await Lead.countDocuments({ stage: "lost" }) },
        ].filter(s => s.count > 0);

        // Latest 5 leads
        const recentLeads = await Lead.find()
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // recentActivities — fetch from the actual Activity table
        const rawActivities = await Activity.find()
            .populate("leadId", "name")
            .populate("clientId", "name")
            .populate("createdBy", "name")
            .sort({ createdAt: -1 })
            .limit(10);

        const recentActivities = rawActivities.map(act => ({
            id: act._id,
            text: act.description,
            leadName: act.leadId?.name || act.clientId?.name || "Someone",
            status: act.action,
            time: act.createdAt
        }));

        // Follow-ups due today
        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
        const followUpsTodayCount = await Lead.countDocuments({
            nextFollowUpDate: { $gte: todayStart, $lte: todayEnd },
            status: { $ne: "converted" },
            deletedAt: null
        });

        res.status(200).json({
            success: true,
            message: "Dashboard stats retrieved",
            data: {
                totalLeads,
                totalClients,
                totalProjects,
                convertedLeads,
                conversionRate,
                leadsByStatus,
                stageBreakdown,
                recentLeads,
                recentActivities,
                followUpsTodayCount,
            },
        });
    );
    }
};

module.exports = { getDashboardStats };