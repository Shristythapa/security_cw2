const router = require("express").Router()
const menteeLogController = require("../controllers/menteeLogsController")

router.get("/getAllMenteeLogs", menteeLogController.getAllMenteeLogs);
router.get("/getMenteeLogById/:id", menteeLogController.getMenteeLogById);
module.exports = router;