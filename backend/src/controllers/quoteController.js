import Quote from "../models/Quote.js";

// @desc    Get quotes
// @route   GET /api/quotes
// @access  Private
export const getQuotes = async (req, res) => {
    try {
        const { clientId } = req.query;
        let filter = {};
        if (clientId) filter.clientId = clientId;
        if (req.user.role === "Sales") filter.assignedTo = req.user.id;

        const quotes = await Quote.find(filter)
            .populate("clientId", "name email")
            .populate("createdBy", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: quotes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create quote
// @route   POST /api/quotes
// @access  Private
export const createQuote = async (req, res) => {
    try {
        const { clientId, amount, status } = req.body;
        const quote = await Quote.create({
            clientId, amount, status, createdBy: req.user.id, assignedTo: req.user.id
        });
        res.status(201).json({ success: true, data: quote });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
