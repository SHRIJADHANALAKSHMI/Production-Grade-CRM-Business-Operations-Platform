import express from "express";
import { getClients, getClientById, deleteClient, getFullClientData } from "../controllers/clientController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
    .get(protect, getClients);

router.route("/:id/full-data")
    .get(protect, getFullClientData);

router.route("/:id")
    .get(protect, getClientById)
    .delete(protect, admin, deleteClient);

export default router;
