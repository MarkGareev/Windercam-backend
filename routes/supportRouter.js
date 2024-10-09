const Router = require("express");
const router = new Router();
const supportController = require("../controllers/supportController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.get("/", authMiddleware, supportController.getSupports);
router.post("/", authMiddleware, supportController.createSupport);
router.get("/all", checkRoleMiddleware("ADMIN"), supportController.getAllSupports);
router.get("/:id", authMiddleware, supportController.getSupport);
router.post("/:id", authMiddleware, supportController.sendMessage);

module.exports = router;
