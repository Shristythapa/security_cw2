const Mentor = require("../model/mentor");
const cloudainary = require("cloudinary");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { add } = require("date-fns");
const nodemailer = require("nodemailer");
const MentorPasswords = require("../model/passwordMentor");

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (
    password.length >= minLength &&
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

  console.log(req.body);

  if (
    name == "" ||
    email == "" ||
    password == "" ||
    !profilePicture ||
    firstName == "" ||
    lastName == "" ||
    dateOfBirth == "" ||
    address == "" ||
    skills == []
  ) {
    return res.json({
      success: false,
      message: "Please enter all fields",
    });
  }
  const isPasswordValid = validatePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }

  if (!profilePicture) {
    return res.status(400).json({
      success: false,
      message: "Please upload Image",
    });
  }

  try {
    const generatedSalt = await bycrypt.genSalt(10);
    const encryptedPassword = await bycrypt.hash(password, generatedSalt);

    const existingMentor = await Mentor.findOne({ email: email });
    if (existingMentor) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const uploadImage = await cloudainary.v2.uploader.upload(
      profilePicture.path,
      {
        folder: "Mentor",
        crop: "scale",
      }
    );
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

      profileUrl: uploadImage.secure_url,
      passwordLastUpdated: Date.now(),
    });

    await newMentor.save();

    console.log(newMentor._id);
    let passwordEntry = await MentorPaswords.findOne({
      userId: newMentor._id,
    });

    if (passwordEntry) {
      passwordEntry.passwords.push(encryptedPassword);
    } else {
      passwordEntry = new MentorPaswords({
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
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const loginMentor = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  try {
    const mentor = await Mentor.findOne({ email: email }); //user stores all data of the users
    if (!mentor) {
      return res.status(400).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const passwordToCompare = mentor.password;
    const isMatch = await bycrypt.compare(password, passwordToCompare);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password dosen't match",
      });
    }

    const token = jwt.sign(
      { id: mentor._id, isMentor: true, email: mentor.email },
      process.env.JWT_TOKEN_SECRET
    );

    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };

    res.cookie("cookieHTTP", token, cookieOptions);

    return res.status(200).json({
      success: true,
      mentor: mentor,
      message: "User loged in Sucessfully",
    });
  } catch (error) {
    return res.status(400).json({
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
      return res.status(400).json({
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
      return res.status(400).json({ error: "Invalid mentor ID" });
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
      return res.status(400).json({
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
      return res.status(400).json({
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
    return res.status(400).json({
      message: "Enter email",
      success: false,
    });
  }
  Mentor.findOne({ email: email }).then((user) => {
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not existed", success: false });
    }
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

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
      } else {
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
      return res
        .status(400)
        .json({ message: "User ID, password, and token are required" });
    }

    // Fetch all password records for the user
    const passwordRecords = await MentorPasswords.find({ userId: id });
    if (!passwordRecords || passwordRecords.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify JWT token
    jwt.verify(token, "jwt_secret_key", async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      // Check if the new password matches any previous passwords
      for (const record of passwordRecords) {
        for (const oldPassword of record.passwords) {
          const match = await bycrypt.compare(password, oldPassword);
          if (match) {
            return res
              .status(400)
              .json({ message: "Can't repeat previous passwords" });
          }
        }
      }

      // Hash the new password
      const generatedSalt = await bycrypt.genSalt(10);
      const hashedPassword = await bycrypt.hash(password, generatedSalt);

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
