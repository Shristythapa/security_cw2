const router = require("express").Router()
const menteeLogController = require("../controllers/menteeLogsController")
const { isAdmin } = require("../middleware/authguard");
router.get("/getAllMenteeLogs",isAdmin, menteeLogController.getAllMenteeLogs);
router.get(
  "/getMenteeLogById/:id",isAdmin,
  menteeLogController.getMenteeLogById
);
module.exports = router;