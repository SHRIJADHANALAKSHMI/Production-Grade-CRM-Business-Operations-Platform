import express from "express";
import { getLeads, createLead, updateLead, deleteLead, convertLeadToClient, assignLead } from "../controllers/leadController.js";
import { protect, admin } from "../middleware/auth.js";
import { validate, leadValidation } from "../middleware/validator.js";

const router = express.Router();

router.route("/")
    .get(protect, getLeads)
    .post(protect, leadValidation, validate, createLead);

router.route("/:id")
    .patch(protect, updateLead)
    .delete(protect, admin, deleteLead);

router.route("/:id/assign")
    .patch(protect, assignLead);

router.route("/:id/convert")
    .post(protect, convertLeadToClient);

export default router;
