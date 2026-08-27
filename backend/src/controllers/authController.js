import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists", data: null });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "Sales",
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id, user.role),
                }
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid user data", data: null });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                success: true,
                message: "Login successful",
                data: {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id, user.role),
                }
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password", data: null });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};
