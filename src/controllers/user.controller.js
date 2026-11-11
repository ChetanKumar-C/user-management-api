
const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

// CREATE USER
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            (role !== undefined && typeof role !== "string")
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid input types"
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
            });
        }

        if (role !== undefined && !["USER", "ADMIN"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user role"
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Save user
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                passwordHash,
                ...(role ? { role } : {})
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });

    } catch (error) {

        // Duplicate email
        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// GET USER BY ID
const getUserById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// UPDATE USER
const updateUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, email, password, role } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const allowedFields = ["name", "email", "password", "role"];

        if (
            Object.keys(req.body).length === 0 ||
            Object.keys(req.body).some(field => !allowedFields.includes(field))
        ) {
            return res.status(400).json({
                success: false,
                message: "Provide valid fields to update"
            });
        }

        const data = {};

        if (name !== undefined) {
            if (typeof name !== "string" || name.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: "Name must contain at least 2 characters"
                });
            }
            data.name = name.trim();
        }

        if (email !== undefined) {
            if (
                typeof email !== "string" ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email address"
                });
            }
            data.email = email.trim().toLowerCase();
        }

        if (password !== undefined) {
            if (typeof password !== "string" || password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: "Password must contain at least 8 characters"
                });
            }
            data.passwordHash = await bcrypt.hash(password, 10);
        }

        if (role !== undefined) {
            if (!["USER", "ADMIN"].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user role"
                });
            }
            data.role = role;
        }

        const user = await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });

    } catch (error) {

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// DELETE USER
const deleteUser = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        await prisma.user.delete({
            where: { id }
        });

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
