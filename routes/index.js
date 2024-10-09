const Router = require("express");
const router = new Router();
const softwareRouter = require("./softwareRouter");
const componentRouter = require("./componentRouter");
const basketRouter = require("./basketRouter");
const orderRouter = require("./orderRouter");
const supportRouter = require("./supportRouter");
const userRouter = require("./userRouter");

router.use("/user", userRouter);
router.use("/software", softwareRouter);
router.use("/component", componentRouter);
router.use("/basket", basketRouter);
router.use("/order", orderRouter);
router.use("/support", supportRouter);


module.exports = router;
