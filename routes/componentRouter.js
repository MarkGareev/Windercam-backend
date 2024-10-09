const Router = require("express");
const router = new Router();
const componentController = require("../controllers/componentController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.post("/", checkRoleMiddleware("ADMIN"), componentController.create);
router.get("/", componentController.getAll);
router.get("/:id", componentController.getOne);

module.exports = router;
