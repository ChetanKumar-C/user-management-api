
const express = require("express");
const router = express.Router();

const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/user.controller");

// CREATE USER
router.post("/", createUser);

// GET ALL USERS
router.get("/", getAllUsers);

// GET USER BY ID
router.get("/:id", getUserById);

// UPDATE USER
router.patch("/:id", updateUser);

// DELETE USER
router.delete("/:id", deleteUser);

module.exports = router;
