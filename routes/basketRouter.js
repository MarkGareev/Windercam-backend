const Router = require("express");
const router = new Router();
const basketController = require("../controllers/basketController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, basketController.getBasket);
router.post("/", authMiddleware, basketController.addItemToBasket);
router.put("/", authMiddleware, basketController.updateQuantuity);
router.delete("/", authMiddleware, basketController.deleteItemFromBasket);

module.exports = router;
