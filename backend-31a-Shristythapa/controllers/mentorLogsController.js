const MentorLog = require("../model/mentorLogModel");

const getAllMentorLogs = async (req, res) => {
  try {
    const activityLogs = await MentorLog.find().populate("mentorId");

    if (activityLogs.length === 0) {
      return res.json({ success: false, message: "No activity logs found" });
    }

    res.status(200).json({ success: true, mentorLogs: activityLogs });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

const getMentorLogById = async (req, res) => {
  try {
    const  id  = req.params.id;
    console.log(id);
    const mentorLog = await MentorLog.findById(id).populate("mentorId");
    
    if (!mentorLog) {
      return res
    
        .json({ success: false, message: "Mentor log not found" });
    }

    res.status(200).json({ success: true,mentorLog: mentorLog });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getAllMentorLogs,
  getMentorLogById
};
