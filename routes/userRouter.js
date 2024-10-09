const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/all", checkRoleMiddleware("ADMIN"), userController.getAll);
router.patch("/", authMiddleware, userController.updateProfile);
router.get("/", authMiddleware, userController.getProfile);

module.exports = router;
