const MenteeLog = require("../model/menteeLogModel");

const getAllMenteeLogs = async (req, res) => {
  try {
    const activityLogs = await MenteeLog.find().populate("menteeId");

    if (activityLogs.length === 0) {
      return res.json({ success: false, message: "No activity logs found" });
    }

    res.status(200).json({ success: true, activityLogs });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
    getAllMenteeLogs
}