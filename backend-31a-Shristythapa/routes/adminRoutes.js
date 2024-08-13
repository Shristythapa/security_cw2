const router = require("express").Router();
const { adminLogin } = require("../controllers/adminController");

router.post("/adminLogin", adminLogin);

module.exports = router;