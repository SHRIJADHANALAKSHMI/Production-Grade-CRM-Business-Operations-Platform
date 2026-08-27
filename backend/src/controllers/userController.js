import User from "../models/User.js";

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: null
        });
    }
};
