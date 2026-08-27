import express from "express";
import { getClients, createClient, updateClient, deleteClient, getClientById, getFullClientData } from "../controllers/clientController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
    .get(protect, authorize("Admin", "Manager", "Sales"), getClients)
    .post(protect, authorize("Admin", "Manager", "Sales"), createClient);

router.route("/:id/full-data")
    .get(protect, authorize("Admin", "Manager", "Sales"), getFullClientData);

router.route("/:id")
    .get(protect, authorize("Admin", "Manager", "Sales"), getClientById)
    .put(protect, authorize("Admin", "Manager", "Sales"), updateClient)
    .delete(protect, authorize("Admin", "Manager"), deleteClient);

export default router;
