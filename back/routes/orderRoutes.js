const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authMiddleware } = require("../middleWare/auth");

router.post("/create", authMiddleware, orderController.createOrder);
router.get("/my-orders", authMiddleware, orderController.getOrdersByUser);

module.exports = router;
