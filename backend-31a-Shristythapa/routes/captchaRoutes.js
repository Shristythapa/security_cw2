const router = require("express").Router();
const captchaController = require("../controllers/captcha_controller");
router.post("/postCaptcha", captchaController.captchaCheck);
module.exports = router;