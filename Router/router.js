const router = require("express").Router();
const controller = require("../Controller/controller")
const {authMiddleware} = require("../Middleware/authMiddleware")


router.post("/register",controller.register);
router.post("/login",controller.login);
router.post("/ask-jiji",authMiddleware,controller.askJiJi);

module.exports = router;