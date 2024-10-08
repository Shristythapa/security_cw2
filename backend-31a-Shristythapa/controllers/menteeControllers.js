const Mentees = require("../model/menteeModel");
const cloudinary = require("cloudinary").v2;
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const MenteePaswords = require("../model/passwordMentee");
const Mentee = require("../model/menteeModel");
const MenteeLog = require("../model/menteeLogModel");


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

const signUpMentee = async (req, res) => {
  console.log(req.body);

  const { name, email, password } = req.body;
  const { profilePicture } = req.files;

  if (!name || !email || !password) {
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
        "Password must be 8-12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }

  if (!profilePicture) {
    return res.json({
      success: false,
      message: "Please upload an image",
    });
  }
  if (!profilePicture.mimetype.startsWith("image/")) {
    console.log("not image");
    return res.json({
      success: false,
      message: "Not an image! Please upload an image file.",
    });
  }
  const newFileName =
    Date.now() + "-" + path.basename(profilePicture.originalFilename);

  try {
    const uploadedImage = await cloudinary.uploader.upload(
      profilePicture.filepath,
      {
        folder: "Mentee",
        public_id: newFileName,
        crop: "scale",
      }
    );

    // Delete the local file after upload
    fs.unlinkSync(profilePicture.filepath);

    // Check if the mentee already exists
    const existingMentee = await Mentees.findOne({ email: email });
    if (existingMentee) {
      console.log("User already exists");
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password
    const generatedSalt = await bycrypt.genSalt(10);
    const encryptedPassword = bycrypt.hash(password, generatedSalt);

    // Create new mentee
    const newMentee = new Mentees({
      name: name,
      email: email,
      password: encryptedPassword,
      profileUrl: uploadedImage.secure_url,
      passwordLastUpdated: Date.now(),
    });

    await newMentee.save();
    console.log("Saved");

    // Save password history
    let passwordEntry = await MenteePaswords.findOne({
      userId: newMentee._id,
    });
    passwordEntry = new MenteePaswords({
      userId: newMentee._id,
      passwords: [encryptedPassword],
    });

    await passwordEntry.save();

    return res.status(200).json({
      success: true,
      message: "User created successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Server error",
    });
  }
};

const loginMentee = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  try {
    const mentee = await Mentees.findOne({ email: email });

    if (!mentee) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Await the result of bcrypt.compare
    const isMatch = await bycrypt.compare(password, mentee.password);

    if (!isMatch) {
      // Log failed attempt
      await MenteeLog.updateOne(
        { menteeId: mentee._id },
        {
          $push: {
            logins: { time: new Date(), failedAttempts: 1 },
          },
        },
        { upsert: true }
      );
      return res.json({
        success: false,
        message: "Password doesn't match",
      });
    }

    req.session.user = {
      id: mentee._id,
      name: mentee.name,
      email: mentee.email,
      profileUrl: mentee.profileUrl,
      isMentor: false,
    };

    console.log("user registered");

    // Log successful login
    await MenteeLog.updateOne(
      { menteeId: mentee._id },
      {
        $push: {
          logins: { time: new Date() },
        },
      },
      { upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
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
  Mentees.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.json({
        message: "User not existed",
        success: false,
      });
    }
    const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
      expiresIn: "2h",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "testing99st@gmail.com",
        pass: "cohbyloqsegkxbeu",
      },
    });

    var mailOptions = {
      from: "thapashristy110@gmail.com",
      to: email,
      subject: "Reset Password Link",
      text: `https://localhost:3000/resetMentorPassword/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        return res.json({ success: false, message: "Mail Send Unsucessful" });
      } else {
        // Log the requestTime in MenteeLog
        const menteeLog = await MenteeLog.findOne({ menteeId: user._id });
        const requestTime = new Date();

        if (menteeLog) {
          menteeLog.forgotPassword.push({
            requestTime: requestTime,
            changedTime: null,
            gapTime: null,
          });
          await menteeLog.save();
        } else {
          await MenteeLog.create({
            menteeId: user._id,
            forgotPassword: [
              {
                requestTime: requestTime,
                changedTime: null,
                gapTime: null,
              },
            ],
          });
        }
        return res.json({ success: true, message: "Mail" });
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
      return res.json({ error: "User ID, password, and token are required" });
    }

    // Fetch all password records for the user
    const passwordRecords = await MenteePaswords.find({ userId: id });
    if (!passwordRecords || passwordRecords.length === 0) {
      return res.json({ message: "User not found" , success:false});
    }
    console.log(passwordRecords);

    // Verify JWT token
    jwt.verify(token, "jwt_secret_key", async (err, decoded) => {
      if (err) {
        return res.json({ message: "Invalid or expired token", success:false });
      }

      // Check if the new password matches any previous passwords
      for (const record of passwordRecords) {
        for (const oldPassword of record.passwords) {
          const match = await bycrypt.compare(password, oldPassword);
          if (match) {
            return res.json({ message: "Can't repeat previous passwords",success:false });
          }
        }
      }

      // Hash the new password
      const generatedSalt = await bycrypt.genSalt(10);
      const hashedPassword = await bycrypt.hash(password, generatedSalt);

      // Update the user's password
      await Mentee.findByIdAndUpdate(id, { password: hashedPassword });
      console.log("password updated");

      // Add the new hashed password to the password records
      for (const record of passwordRecords) {
        record.passwords.push(hashedPassword);
        await record.save();
      }
      // Update the forgotPassword log with changedTime and gapTime
      const menteeLog = await MenteeLog.findOne({ menteeId: id });
      if (menteeLog) {
        const changedTime = new Date();

        for (let log of menteeLog.forgotPassword) {
          if (!log.changedTime) {
            // Assuming you only want to update the latest entry without a changedTime
            log.changedTime = changedTime;
            log.gapTime = changedTime - log.requestTime; // gapTime in milliseconds
            break;
          }
        }

        await menteeLog.save();
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
  signUpMentee,
  loginMentee,
  changePassword,
  updatePassword,
};
