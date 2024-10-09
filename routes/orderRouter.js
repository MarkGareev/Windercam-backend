const Router = require("express");
const router = new Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, orderController.getOrders);
router.post("/", authMiddleware, orderController.createOrder);

module.exports = router;
