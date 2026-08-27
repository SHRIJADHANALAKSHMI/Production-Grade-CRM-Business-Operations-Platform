import Client from "../models/Client.js";

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
export const getClients = async (req, res) => {
    try {
        const clients = await Client.find().populate("convertedFrom", "name email");
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
export const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).populate("convertedFrom", "name email");

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
