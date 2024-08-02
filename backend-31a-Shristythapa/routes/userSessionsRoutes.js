const controller = require("../controllers/userSessionsController");
const router = require("express").Router();

router.post("/logout", controller.logout);
router.post("/validate", controller.validateSession);

module.exports = router;
