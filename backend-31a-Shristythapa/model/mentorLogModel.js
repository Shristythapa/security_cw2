const mongoose = require("mongoose");
const { Schema } = mongoose;

const mentorLogSchema = new Schema({
  mentorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Mentor",
  },
  logins: [
    {
      time: {
        type: Date,
        required: true,
      },
      failedAttempts: {
        type: Number,
        default: 0,
      },
    },
  ],
  logouts: [
    {
      type: Date,
    },
  ],
  forgotPassword: [
    {
      requestTime: {
        type: Date,
      },
      changedTime: {
        type: Date,
      },
      gapTime: {
        type: Number, // Assuming this is in milliseconds
      },
    },
  ],
});

const MentorLog = mongoose.model("MentorLog", mentorLogSchema);

module.exports = MentorLog;
