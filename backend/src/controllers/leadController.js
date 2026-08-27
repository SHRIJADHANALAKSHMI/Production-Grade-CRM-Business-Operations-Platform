import Lead from "../models/Lead.js";
import Client from "../models/Client.js";
import User from "../models/User.js";

// @desc    Get all leads (with optional status filter)
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const leads = await Lead.find(filter).populate("assignedTo", "name email");
        res.status(200).json({ success: true, message: "Leads retrieved successfully", data: leads });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req, res) => {
    const { name, email, phone, status } = req.body;
    try {
        const lead = await Lead.create({
            name,
            email,
            phone,
            status: status || "new",
            assignedTo: req.user.id,
        });
        res.status(201).json({ success: true, message: "Lead created successfully", data: lead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Update lead status (or general attributes)
// @route   PATCH /api/leads/:id
// @access  Private
export const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found", data: null });

        const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, message: "Lead updated successfully", data: updatedLead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Re-assign lead to a new user
// @route   PATCH /api/leads/:id/assign
// @access  Private/Admin
export const assignLead = async (req, res) => {
    try {
        const { userId } = req.body;
        const lead = await Lead.findById(req.params.id);
        const user = await User.findById(userId);

        if (!lead) return res.status(404).json({ success: false, message: "Lead not found", data: null });
        if (!user) return res.status(404).json({ success: false, message: "Target user not found", data: null });

        lead.assignedTo = userId;
        await lead.save();

        res.status(200).json({ success: true, message: "Lead reassigned successfully", data: lead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private/Admin
export const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found", data: null });

        await lead.deleteOne();
        res.status(200).json({ success: true, message: "Lead removed", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Convert lead into client
// @route   POST /api/leads/:id/convert
// @access  Private
export const convertLeadToClient = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found", data: null });
        if (lead.status === "converted") return res.status(400).json({ success: false, message: "Lead is already converted", data: null });

        const client = await Client.create({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            convertedFrom: lead._id
        });

        lead.status = "converted";
        await lead.save();

        res.status(201).json({ success: true, message: "Lead converted perfectly", data: { client, lead } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};
