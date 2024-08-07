const router = require("express").Router();
const mentorLogController = require("../controllers/mentorLogsController");

router.get("/getAllMentorLogs", mentorLogController.getAllMentorLogs);

module.exports = router;
