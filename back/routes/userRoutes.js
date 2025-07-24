const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleWare/auth");
const userController = require("../controllers/userController");

router.post("/signup", userController.signupUser);
router.post("/signin", userController.signinUser);
router.post("/signinByGoogle", userController.signinUserByGoogle);
router.post("/signinByFacebook", userController.signinUserByFacebook);
router.get("/verify-email", userController.verifyEmail)
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
// router.delete("/:id", userController.deleteUser);

// Route admin cần token và quyền admin

router.get("/", authMiddleware, isAdmin, userController.getAllUsers);
router.put("/:id/promote", authMiddleware, isAdmin, userController.updateUserRole);
router.put("/:id/block", authMiddleware, isAdmin, userController.blockUserRole);




module.exports = router;
