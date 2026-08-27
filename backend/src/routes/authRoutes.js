import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { validate, registerValidation, loginValidation } from "../middleware/validator.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: "Too many authentication attempts, please try again later", data: null }
});

router.post("/register", authLimiter, registerValidation, validate, registerUser);
router.post("/login", authLimiter, loginValidation, validate, loginUser);

export default router;
