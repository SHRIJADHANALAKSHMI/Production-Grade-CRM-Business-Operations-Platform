import Client from "../models/Client.js";
import Lead from "../models/Lead.js";

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
export const getClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Convert lead to client
// @route   POST /api/clients/convert/:leadId
// @access  Private
export const convertLeadToClient = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.leadId);
        if (!lead) return res.status(404).json({ message: "Lead not found" });

        // Create a new client from lead data
        const client = await Client.create({
            company: lead.company,
            email: lead.email,
            phone: lead.phone,
        });

        // Delete the lead as it's now converted
        await lead.deleteOne();

        res.status(201).json({ message: "Lead converted successfully", client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
