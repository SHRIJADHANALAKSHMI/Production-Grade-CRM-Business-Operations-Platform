import express from "express";
import { getClients, getClientById, deleteClient } from "../controllers/clientController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
    .get(protect, getClients);

router.route("/:id")
    .get(protect, getClientById)
    .delete(protect, admin, deleteClient);

export default router;
