import express from "express";
import { getClients, convertLeadToClient } from "../controllers/clientController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
    .get(protect, getClients);

router.route("/convert/:leadId")
    .post(protect, convertLeadToClient);

export default router;
