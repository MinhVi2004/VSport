const express = require("express");
const router = express.Router();
const upload = require("../middleWare/upload");
const productController = require("../controllers/productController");
const {authMiddleware, isAdmin} = require("../middleWare/auth")
// Sản phẩm
router.post("/", authMiddleware, isAdmin, upload.array("images", 6), productController.createProduct);
router.put("/:id", authMiddleware, isAdmin, upload.array("images", 6), productController.updateProduct);

router.get("/", productController.getAllProducts);
// Đặt cụ thể trước chung chung để tránh nhầm route
router.get("/category/:id", productController.getAllProductByCategory);
router.get("/detail/:id", productController.getProductDetailById);
router.get("/:id", productController.getProductById); // để cuối cùng

router.delete("/:id", productController.deleteProduct);

// Biến thể
router.post("/variant/:id", authMiddleware, isAdmin,upload.single("image"), productController.createVariant);
router.put("/variant/:productId/:variantId", authMiddleware, isAdmin,upload.single("image"), productController.updateVariant);
router.delete("/variant/:id", authMiddleware, isAdmin,productController.deleteVariant);

module.exports = router;
