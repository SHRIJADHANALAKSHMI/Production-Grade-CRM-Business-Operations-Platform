import express from "express";
import {
    getLeads,
    createLead,
    updateLead,
    deleteLead,
    convertLeadToClient,
    assignLead,
    getFollowUpLeads
} from "../controllers/leadController.js";
import { protect, admin } from "../middleware/auth.js";
import { validate, leadValidation } from "../middleware/validator.js";

const router = express.Router();

// Special routes BEFORE :id param
router.get("/followups", protect, getFollowUpLeads);

// Main collection routes
router.route("/")
    .get(protect, getLeads)
    .post(protect, leadValidation, validate, createLead);

// Single resource routes
router.route("/:id")
    .patch(protect, updateLead)
    .delete(protect, admin, deleteLead);

// Action routes
router.patch("/:id/assign", protect, admin, assignLead);
router.post("/:id/convert", protect, convertLeadToClient);

export default router;
