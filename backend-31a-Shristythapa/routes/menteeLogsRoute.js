const router = require("express").Router()
const menteeLogController = require("../controllers/menteeLogsController")
const { isAdmin } = require("../middleware/authguard");
router.get("/getAllMenteeLogs", menteeLogController.getAllMenteeLogs);
router.get(
  "/getMenteeLogById/:id",
  menteeLogController.getMenteeLogById
);
module.exports = router;