const express = require("express");
const router = express.Router();
const StaffController = require("../controllers/staffController");
const {authMiddleware, isStaff} = require("./../middleWare/auth");


router.use(authMiddleware, isStaff);


router.get("/orderToday", StaffController.getOrderToday);
router.get("/:id",  StaffController.getItemFromQRCode);
router.post("/",  StaffController.createOrder);

module.exports = router;