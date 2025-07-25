const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authMiddleware } = require('../middleWare/auth');

router.use(authMiddleware);
router.get("/", cartController.getCart);
router.get("/count", cartController.getCartCount);
router.post("/", cartController.addToCart);
router.post("/merge", cartController.mergeCart);
router.put("/", cartController.updateCartItem);
router.delete("/:itemId", cartController.removeCartItem);

module.exports = router;
