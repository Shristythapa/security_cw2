const mongoose = require("mongoose");
const { Schema } = mongoose;

const passwordMentorSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Mentor",
    required: true,
  },
  passwords: {
    type: [String],
    required: true,
  },
});

const MentorPasswords = mongoose.model("MentorPasswords", passwordMentorSchema);
module.exports = MentorPasswords;
