import Lead from "../models/Lead.js";

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find().populate("assignedTo", "name email");
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req, res) => {
    const { title, company, email, phone, status } = req.body;
    try {
        const lead = await Lead.create({
            title,
            company,
            email,
            phone,
            status: status || "New",
            assignedTo: req.user.id,
        });
        res.status(201).json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update lead status
// @route   PUT /api/leads/:id
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
