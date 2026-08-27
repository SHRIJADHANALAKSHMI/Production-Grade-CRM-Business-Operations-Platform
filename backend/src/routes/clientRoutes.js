import express from "express";
import { getClients, getClientById } from "../controllers/clientController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
    .get(protect, getClients);

router.route("/:id")
    .get(protect, getClientById);

export default router;
