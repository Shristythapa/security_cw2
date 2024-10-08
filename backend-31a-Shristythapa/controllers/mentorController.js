const Mentor = require("../model/mentorModel");
const cloudinary = require("cloudinary").v2;
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const MentorPasswords = require("../model/passwordMentor");
const { id } = require("date-fns/locale");
const MentorLog = require("../model/mentorLogModel");
const validatePassword = (password) => {
  const minLength = 8;
  const maxLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (
    password.length >= minLength &&
    password.length < maxLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChars
  ) {
    return true;
  }
  return false;
};

const signUpMentor = async (req, res) => {
  const {
    name,
    email,
    password,
    firstName,
    lastName,
    dateOfBirth,
    address,
    skills,
  } = req.body;

  const { profilePicture } = req.files;

  if (
    !name ||
    !email ||
    !password ||
    !profilePicture ||
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !address ||
    !skills
  ) {
    return res.json({
      success: false,
      message: "Please enter all fields",
    });
  }

  const isPasswordValid = validatePassword(password);
  if (!isPasswordValid) {
    return res.json({
      success: false,
      message:
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }

  // Check if the mentor already exists
  const existingMentor = await Mentor.findOne({ email: email });
  if (existingMentor) {
    return res.json({
      success: false,
      message: "User already exists",
    });
  }

  // Validate MIME type
  if (!profilePicture.mimetype.startsWith("image/")) {
    return res.status(400).json({
      success: false,
      message: "Not an image! Please upload an image file.",
    });
  }
  // Rename file with a unique name
  const newFileName =
    Date.now() + "-" + path.basename(profilePicture.originalFilename);
  try {
    // Upload to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(
      profilePicture.path,
      {
        folder: "Mentor",
        public_id: newFileName,
        crop: "scale",
      }
    );

    // Delete the local file after upload
    fs.unlinkSync(profilePicture.path);

    // Hash the password
    const generatedSalt = await bycrypt.genSalt(10);
    const encryptedPassword = await bycrypt.hash(password, generatedSalt);

    // Create new mentor
    const newMentor = new Mentor({
      name: name,
      email: email,
      password: encryptedPassword,
      mentorProfileInformation: {
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        address: address,
        skills: skills,
      },
      profileUrl: uploadedImage.secure_url,
      passwordLastUpdated: Date.now(),
    });

    await newMentor.save();

    // Save password history
    let passwordEntry = await MentorPasswords.findOne({
      userId: newMentor._id,
    });
    if (passwordEntry) {
      passwordEntry.passwords.push(encryptedPassword);
    } else {
      passwordEntry = new MentorPasswords({
        userId: newMentor._id,
        passwords: [encryptedPassword],
      });
    }

    await passwordEntry.save();

    res.status(200).json({
      success: true,
      message: "User created successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const loginMentor = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  try {
    const mentor = await Mentor.findOne({ email: email }); //user stores all data of the users
    if (!mentor) {
      console.log("mentor not found");
      return res.json({
        success: false,
        message: "Mentor not found",
      });
    }

    const passwordToCompare = mentor.password;
    const isMatch = await bycrypt.compare(password, passwordToCompare);

    if (!isMatch) {
      await MentorLog.updateOne(
        { mentorId: mentor._id },
        {
          $push: {
            logins: { time: new Date(), failedAttempts: 1 },
          },
        },
        { upsert: true }
      );
      return res.json({
        success: false,
        message: "Password dosen't match",
      });
    }

    req.session.user = {
      id: mentor._id,
      name: mentor.name,
      email: mentor.email,
      profileUrl: mentor.profileUrl,
      isMentor: true,
    };

    await MentorLog.updateOne(
      { mentorId: mentor._id },
      {
        $push: {
          logins: { time: new Date() },
        },
      },
      { upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "User loged in Sucessfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error,
    });
  }
};

const findByEmail = async (req, res) => {
  try {
    const encodedEmail = req.params.email;
    const email = decodeURIComponent(encodedEmail);
    const user = await Mentor.findOne({ email: email });

    if (!user) {
      return res.json({
        success: false,
        message: "Mentor doesn't exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "MENTOR FOUND",
      mentor: user,
    });
  } catch (e) {
    return res.stauts(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getMentorById = async (req, res) => {
  try {
    const mentorId = req.params.id;

    if (!mentorId) {
      return res.json({ error: "Invalid mentor ID" });
    }
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.status(200).json({ mentor });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMentorProfile = async (req, res) => {
  try {
    const myMentor = await Mentor.findOne({ email: req.params.email });
    if (!myMentor) {
      return res.json({
        success: false,
        message: "Mentor doesn't exist",
      });
    }
    return res.status(200).json({
      success: true,
      message: "MENTOR FOUND",
      mentor: myMentor,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find();

    if (!mentors) {
      return res.json({
        success: false,
        messgae: "Mentors not",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Mentors listed",
      mentors: mentors,
    });
  } catch (e) {
    return res.stauts(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const changePassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      message: "Enter email",
      success: false,
    });
  }
  Mentor.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.json({ message: "User not existed", success: false });
    }
    console.log(user);
    const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
      expiresIn: "1h",
    });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "testing99st@gmail.com",
        pass: "cohbyloqsegkxbeu",
      },
    });

    var mailOptions = {
      to: email,
      subject: "Reset Password Link",
      text: `https://localhost:3000/resetMentorPassword/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        return res.json({ success: false, message: "Mail Send Unsucessful" });
      } else {
        // Log the requestTime in mentorLog
        const mentorLog = await MentorLog.findOne({ mentor: user._id });
        const requestTime = new Date();

        if (mentorLog) {
          mentorLog.forgotPassword.push({
            requestTime: requestTime,
            changedTime: null,
            gapTime: null,
          });
          await mentorLog.save();
        } else {
          await MentorLog.create({
            mentorId: user._id,
            forgotPassword: [
              {
                requestTime: requestTime,
                changedTime: null,
                gapTime: null,
              },
            ],
          });
        }
        return res
          .status(200)
          .json({ success: true, message: "Password Changed" });
      }
    });
  });
};

const updatePassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    // Validate input
    if (!id || !password || !token) {
      return res.json({ message: "User ID, password, and token are required" });
    }

    // Fetch all password records for the user
    const passwordRecords = await MentorPasswords.find({ userId: id });
    if (!passwordRecords || passwordRecords.length === 0) {
      return res.json({ message: "User not found", success: false });
    }

    // Verify JWT token
    jwt.verify(token, "jwt_secret_key", async (err, decoded) => {
      if (err) {
        return res.json({ message: "Invalid or expired token" , success: false});
      }

      // Check if the new password matches any previous passwords
      for (const record of passwordRecords) {
        for (const oldPassword of record.passwords) {
          const match = await bycrypt.compare(password, oldPassword);
          if (match) {
            return res.json({ message: "Can't repeat previous passwords", success:false });
          }
        }
      }
      // Hash the new password
      const generatedSalt = await bycrypt.genSalt(10);
      const hashedPassword = await bycrypt.hash(password, generatedSalt);

      // Update the user's password
      await Mentor.findByIdAndUpdate(id, { password: hashedPassword });
      console.log("password updated");

      // Add the new hashed password to the password records
      for (const record of passwordRecords) {
        record.passwords.push(hashedPassword);
        await record.save();
      }
      // Update the forgotPassword log with changedTime and gapTime
      const mentorLog = await MentorLog.findOne({ mentorId: id });
      if (mentorLog) {
        const changedTime = new Date();

        for (let log of mentorLog.forgotPassword) {
          if (!log.changedTime) {
            // Assuming you only want to update the latest entry without a changedTime
            log.changedTime = changedTime;
            log.gapTime = changedTime - log.requestTime; // gapTime in milliseconds
            break;
          }
        }

        await mentorLog.save();
      }

      // Update the user's password
      await Mentor.findByIdAndUpdate(id, { password: hashedPassword });

      // Add the new hashed password to the password records
      for (const record of passwordRecords) {
        record.passwords.push(hashedPassword);
        await record.save();
      }

      res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signUpMentor,
  loginMentor,
  getAllMentors,
  getMentorById,
  findByEmail,
  getMentorProfile,
  changePassword,
  updatePassword,
};
