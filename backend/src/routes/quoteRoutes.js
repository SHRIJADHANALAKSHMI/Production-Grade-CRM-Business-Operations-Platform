import express from "express";
import { getQuotes, createQuote } from "../controllers/quoteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
    .get(protect, getQuotes)
    .post(protect, createQuote);

export default router;
