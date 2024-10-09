const Router = require("express");
const router = new Router();
const softwareController = require("../controllers/softwareController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.post("/",checkRoleMiddleware("ADMIN"), softwareController.create);
router.get("/", softwareController.getAll);
router.get("/:id", softwareController.getOne);

module.exports = router;
