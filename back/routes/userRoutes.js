const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleWare/auth");
const userController = require("../controllers/userController");

router.post("/signup", userController.signupUser);
router.post("/signin", userController.signinUser);

router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
// router.delete("/:id", userController.deleteUser);
// Route admin cần token và quyền admin
router.get("/", authMiddleware, isAdmin, userController.getAllUsers);



// router.get("/", userController.getAllUsers);
// router.post("/", userController.createUser);


module.exports = router;
