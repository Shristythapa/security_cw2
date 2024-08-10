const MenteeLog = require("../model/menteeLogModel");
const MentorLog = require("../model/mentorLogModel");

const logout = (req, res) => {
  req.session.destroy(async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Failed to logout");
    }
    res.clearCookie("connect.sid");
    if (req.session.user.isMentor) {
      await MentorLog.updateOne(
        { menteeId: user.id },
        {
          $push: {
            logouts: new Date(),
          },
        },
        { upsert: true }
      );
    } else {
      await MenteeLog.updateOne(
        { menteeId: user.id },
        {
          $push: {
            logouts: new Date(),
          },
        },
        { upsert: true }
      );
    }
    res.send("Logout successful");
  });
};

const validateSession = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ valid: false });
  }
  return res.json({
    valid: true,
    user: req.session.user,
  });
};

module.exports = {
  logout,
  validateSession,
};
