import Client from "../models/Client.js";
import Activity from "../models/Activity.js";
import Quote from "../models/Quote.js";
import Project from "../models/Project.js";

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
export const getClients = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === "Sales") filter.assignedTo = req.user.id;

        const clients = await Client.find(filter)
            .populate("convertedFrom")
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, message: "Clients retrieved successfully", data: clients });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
export const createClient = async (req, res) => {
    try {
        const { name, email, phone, convertedFrom, sourceLead, assignedTo } = req.body;

        let clientData = {
            name, email, phone, convertedFrom, sourceLead,
            assignedTo: assignedTo || req.user.id
        };

        const client = await Client.create(clientData);
        res.status(201).json({ success: true, message: "Client created successfully", data: client });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
export const updateClient = async (req, res) => {
    try {
        let filter = { _id: req.params.id };
        if (req.user.role === "Sales") filter.assignedTo = req.user.id;

        const client = await Client.findOneAndUpdate(filter, req.body, {
            new: true, runValidators: true
        });

        if (!client) return res.status(404).json({ success: false, message: "Client not found", data: null });

        res.status(200).json({ success: true, message: "Client updated successfully", data: client });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Get client by ID
// @route   GET /api/clients/:id
// @access  Private
export const getClientById = async (req, res) => {
    try {
        let filter = { _id: req.params.id };

        const client = await Client.findOne(filter).populate("convertedFrom");
        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found or access denied", data: null });
        }

        const [activities, quotes, projects] = await Promise.all([
            Activity.find({ $or: [{ clientId: client._id }, { leadId: client.convertedFrom?._id }] })
                .populate("createdBy", "name")
                .sort({ createdAt: -1 }),
            Quote.find({ clientId: client._id }).sort({ createdAt: -1 }),
            Project.find({ $or: [{ client: client._id }, { clientId: client._id }] })
                .populate("team", "name")
                .sort({ createdAt: -1 })
        ]);

        res.status(200).json({
            success: true,
            message: "Client fetched successfully",
            data: {
                client,
                activities,
                quotes,
                projects
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Get complete 360 view of client (Projects, Tasks, Quotes, Activity, Stats)
// @route   GET /api/clients/:id/full-data
// @access  Private
export const getFullClientData = async (req, res) => {
    try {
        let filter = { _id: req.params.id };

        const client = await Client.findOne(filter).populate("convertedFrom").populate("assignedTo", "name email");
        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found or access denied", data: null });
        }

        const [activities, quotes, projects] = await Promise.all([
            Activity.find({ $or: [{ clientId: client._id }, { leadId: client.convertedFrom?._id }] })
                .populate("createdBy", "name")
                .sort({ createdAt: -1 }),
            Quote.find({ clientId: client._id }).sort({ createdAt: -1 }),
            Project.find({ $or: [{ client: client._id }, { clientId: client._id }] })
                .populate("team", "name")
                .sort({ createdAt: -1 })
        ]);

        // Gather all tasks belonging to these projects
        const projectIds = projects.map(p => p._id);
        const tasks = await import("../models/Task.js").then(m => m.default.find({ $or: [{ project: { $in: projectIds } }, { projectId: { $in: projectIds } }] }).populate("assignedTo", "name"));

        const stats = {
            totalDealsValue: quotes.filter(q => q.status === "accepted").reduce((acc, q) => acc + q.amount, 0),
            activeProjects: projects.filter(p => p.status === "active" || p.status === "planning").length,
            pendingPayments: quotes.filter(q => q.status === "sent" || q.status === "draft").reduce((acc, q) => acc + q.amount, 0),
        };

        res.status(200).json({
            success: true,
            data: { client, activities, quotes, projects, tasks, stats }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

export const deleteClient = async (req, res) => {
    try {
        let filter = { _id: req.params.id };
        if (req.user.role === "Sales") filter.assignedTo = req.user.id;

        const client = await Client.findOne(filter);
        if (!client) return res.status(404).json({ success: false, message: "Client not found or unauth", data: null });
        await client.deleteOne();
        res.status(200).json({ success: true, message: "Client removed", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};
