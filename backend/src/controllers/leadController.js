import mongoose from "mongoose";
import Lead from "../models/Lead.js";
import Client from "../models/Client.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Activity from "../models/Activity.js";
import Task from "../models/Task.js";
import { createActivityLog } from "./activityController.js";
// @desc    Get all leads with optional filters + role scoping
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req, res) => {
    try {
        const roleFilter = req.user.role === "Admin" ? {} : { assignedTo: req.user.id };
        const deleteFilter = { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] };
        const statusFilter = req.query.status ? { status: req.query.status } : {};
        const stageFilter = req.query.stage ? { stage: req.query.stage } : {};
        const searchFilter = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ]
        } : {};

        const filter = {
            ...roleFilter,
            ...deleteFilter,
            ...statusFilter,
            ...stageFilter,
            ...searchFilter
        };

        const pageNum = Number(req.query.page) || 1;
        const limitNum = Number(req.query.limit) || 10;
        const skip = (pageNum - 1) * limitNum;

        const leads = await Lead.find(filter)
            .populate("assignedTo", "name email role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Lead.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: "Leads retrieved successfully",
            data: leads,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Get leads with upcoming follow-ups (today + overdue)
// @route   GET /api/leads/followups
// @access  Private
export const getFollowUpLeads = async (req, res) => {
    try {
        const today = new Date();
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const roleFilter = req.user.role === "Admin" ? {} : { assignedTo: req.user.id };
        const deleteFilter = { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] };

        let filter = {
            ...roleFilter,
            ...deleteFilter,
            nextFollowUpDate: { $lte: endOfDay },
            status: { $ne: "converted" }
        };

        const leads = await Lead.find(filter)
            .populate("assignedTo", "name email")
            .sort({ nextFollowUpDate: 1 });

        res.status(200).json({
            success: true,
            message: "Follow-up leads retrieved",
            data: leads
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req, res) => {
    const { name, email, phone, status, stage, notes, nextFollowUpDate } = req.body;
    try {
        const lead = await Lead.create({
            name, email, phone,
            status: status || "new",
            stage: stage || "new",
            notes: notes || "",
            nextFollowUpDate: nextFollowUpDate || null,
            assignedTo: req.user.id,
            dealValue: req.body.dealValue || 0,
            expectedCloseDate: req.body.expectedCloseDate || null
        });

        // Trigger Log
        await createActivityLog({
            leadId: lead._id,
            action: "created",
            description: "Lead was added to the system",
            createdBy: req.user.id
        });

        res.status(201).json({ success: true, message: "Lead created successfully", data: lead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Update lead (status, stage, notes, followUpDate)
// @route   PATCH /api/leads/:id
// @access  Private
export const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found", data: null });

        const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate("assignedTo", "name email");

        // Trigger Log for Stage/Status/Notes
        let changes = [];
        if (req.body.stage && lead.stage !== req.body.stage) changes.push(`stage to ${req.body.stage}`);
        if (req.body.status && lead.status !== req.body.status) changes.push(`status to ${req.body.status}`);

        if (changes.length > 0) {
            await createActivityLog({
                leadId: lead._id,
                action: "updated",
                description: `Lead updated ${changes.join(" and ")}`,
                createdBy: req.user.id
            });
        }


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
        await lead.populate("assignedTo", "name email");

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
        let filter = { _id: req.params.id };
        if (req.user.role === "Sales") {
            filter.assignedTo = req.user.id;
        }

        const lead = await Lead.findOne(filter);
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found or unauthorized", data: null });

        lead.deletedAt = new Date();
        await lead.save();
        res.status(200).json({ success: true, message: "Lead removed", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Convert lead into client
// @route   POST /api/leads/:id/convert
// @access  Private
export const convertLeadToClient = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const lead = await Lead.findById(req.params.id).session(session);
        if (!lead) throw new Error("Lead not found");
        if (lead.status === "converted") throw new Error("Lead is already converted");

        const existingClient = await Client.findOne({ sourceLead: lead._id }).session(session);
        if (existingClient) {
            throw new Error("Client already exists for this lead");
        }

        // 1. Create Client
        const client = new Client({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            convertedFrom: lead._id,
            sourceLead: lead._id,
            assignedTo: lead.assignedTo
        });
        await client.save({ session });

        // 2. Update Lead
        lead.status = "converted";
        lead.stage = "won";
        lead.client = client._id;
        await lead.save({ session });

        // 3. Create Activity
        const activity = new Activity({
            leadId: lead._id,
            clientId: client._id,
            action: "converted",
            description: "Lead converted to Client",
            createdBy: req.user.id
        });
        await activity.save({ session });

        // 4. Create Project
        const project = new Project({
            client: client._id,
            name: `${client.name} Implementation`,
            owner: lead.assignedTo,
            team: [lead.assignedTo],
            createdBy: req.user.id,
            status: "planning",
            progress: 0,
            startDate: new Date()
        });
        await project.save({ session });

        // 5. Create Tasks
        await Task.insertMany([
            { title: "Kickoff Meeting", project: project._id, assignedTo: lead.assignedTo, status: "todo", priority: "high" },
            { title: "Requirements Gathering", project: project._id, assignedTo: lead.assignedTo, status: "todo", priority: "medium" },
            { title: "Onboarding Configuration", project: project._id, assignedTo: lead.assignedTo, status: "todo", priority: "medium" }
        ], { session });

        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ success: true, message: "Lead converted to client!", data: { client, project } });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ success: false, message: error.message });
    }
};
