const router = require("express").Router();
const mentorLogController = require("../controllers/mentorLogsController");
const { isAdmin } = require("../middleware/authguard");
router.get("/getAllMentorLogs",isAdmin,  mentorLogController.getAllMentorLogs);
router.get(
  "/getMentorLogById/:id",isAdmin,

  mentorLogController.getMentorLogById
);

module.exports = router;
