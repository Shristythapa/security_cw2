const MenteeLog = require("../model/menteeLogModel");

const getAllMenteeLogs = async (req, res) => {
  try {
    const activityLogs = await MenteeLog.find().populate("menteeId");

    if (activityLogs.length === 0) {
      return res.json({ success: false, message: "No activity logs found" });
    }

    res.status(200).json({ success: true, menteeLogs: activityLogs });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

const getMenteeLogById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const menteeLog = await MenteeLog.findById(id).populate("menteeId");

    if (!menteeLog) {
      return res.json({ success: false, message: "MenteeLog log not found" });
    }

    res.status(200).json({ success: true, menteeLog: menteeLog });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getAllMenteeLogs,
  getMenteeLogById
};
