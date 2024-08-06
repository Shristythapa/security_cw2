const router = require("express").Router()
const menteeLogController = require("../controllers/menteeLogsController")

router.get("/getAllMenteeLogs", menteeLogController.getAllMenteeLogs);

module.exports = router;