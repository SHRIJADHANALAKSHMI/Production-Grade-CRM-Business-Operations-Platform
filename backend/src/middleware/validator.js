import { check, validationResult } from "express-validator";

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation errors",
            data: errors.array()
        });
    }
    next();
};

export const registerValidation = [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 })
];

export const loginValidation = [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
];

export const leadValidation = [
    check("name", "Lead name is required").not().isEmpty(),
    check("email", "Valid email is required").isEmail()
];
