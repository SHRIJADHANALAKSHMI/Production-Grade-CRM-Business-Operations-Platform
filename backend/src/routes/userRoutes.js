import express from "express";
import { getUsers } from "../controllers/userController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
    .get(protect, admin, getUsers);

export default router;
