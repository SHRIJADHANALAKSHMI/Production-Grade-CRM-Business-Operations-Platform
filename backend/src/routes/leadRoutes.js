import express from "express";
import { getLeads, createLead, updateLead, deleteLead, convertLeadToClient } from "../controllers/leadController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
    .get(protect, getLeads)
    .post(protect, createLead);

router.route("/:id")
    .patch(protect, updateLead)
    .delete(protect, admin, deleteLead);

router.route("/:id/convert")
    .post(protect, convertLeadToClient);

export default router;
