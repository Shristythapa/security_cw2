const mongoose = require("mongoose");
const { Schema } = mongoose;

const passwordMenteeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Mentee",
    required: true,
  },
  passwords: {
    type: [String],
    required: true,
  },
});

const MenteePasswords = mongoose.model("MenteePasswords", passwordMenteeSchema);
module.exports = MenteePasswords;
