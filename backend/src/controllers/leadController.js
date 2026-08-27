import Lead from "../models/Lead.js";
import Client from "../models/Client.js";

// @desc    Get all leads (with optional status filter)
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const leads = await Lead.find(filter).populate("assignedTo", "name email");
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
            // Assign lead to the user making the request
            assignedTo: req.user.id,
        });
        res.status(201).json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update lead status
// @route   PATCH /api/leads/:id
// @access  Private
export const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedLead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private/Admin
export const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        await lead.deleteOne();
        res.status(200).json({ message: "Lead removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Convert lead into client
// @route   POST /api/leads/:id/convert
// @access  Private
export const convertLeadToClient = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        if (lead.status === "converted") {
            return res.status(400).json({ message: "Lead is already converted" });
        }

        // Create client using lead data
        const client = await Client.create({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            convertedFrom: lead._id
        });

        // Update lead status = "converted"
        lead.status = "converted";
        await lead.save();

        res.status(201).json({ message: "Lead converted successfully", client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
