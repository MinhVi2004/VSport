const express = require("express");
const router = express.Router();
const StaffController = require("../controllers/staffController");

router.get("/:id", StaffController.getItemFromQRCode);

module.exports = router;