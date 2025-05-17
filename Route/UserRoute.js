const express = require("express");
const router = express.Router();

//insert model
const User = require("../Model/UserModel");

//insert user controller
const UserController = require("../Controllers/UserController");

router.get("/", UserController.getAllUsers);
router.post("/", UserController.addUser);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);




//export
module.exports = router;