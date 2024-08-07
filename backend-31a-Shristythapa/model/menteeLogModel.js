const mongoose = require("mongoose");
const { Schema } = mongoose;

const menteeLogSchema = new Schema({
  menteeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "mentees",
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

const MenteeLog = mongoose.model("MenteeLog", menteeLogSchema);

module.exports = MenteeLog;
