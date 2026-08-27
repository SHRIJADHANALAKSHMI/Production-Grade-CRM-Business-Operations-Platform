import express from "express";
import { getLeads, createLead, updateLead, deleteLead } from "../controllers/leadController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
    .get(protect, getLeads)
    .post(protect, createLead);

router.route("/:id")
    .put(protect, updateLead)
    .delete(protect, admin, deleteLead);

export default router;
