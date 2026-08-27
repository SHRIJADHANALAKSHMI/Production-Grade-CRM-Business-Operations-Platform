import Client from "../models/Client.js";

export const getClients = async (req, res) => {
    try {
        const clients = await Client.find().populate("convertedFrom", "name email");
        res.status(200).json({ success: true, message: "Clients retrieved successfully", data: clients });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

export const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).populate("convertedFrom", "name email");
        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found", data: null });
        }
        res.status(200).json({ success: true, message: "Client fetched successfully", data: client });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

export const deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ success: false, message: "Client not found", data: null });
        await client.deleteOne();
        res.status(200).json({ success: true, message: "Client removed", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

