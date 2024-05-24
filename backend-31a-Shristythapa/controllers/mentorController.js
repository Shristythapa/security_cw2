const Mentor = require("../model/mentor");
const cloudainary = require("cloudinary");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { add } = require("date-fns");
const nodemailer = require("nodemailer");

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

  // const skill

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
    });

    await newMentor.save();
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

    return res.status(200).json({
      success: true,
      token: token,
      message: "User loged in successfully",
      mentor: mentor,
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
      expiresIn: "1d",
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
      text: `http://localhost:3000/resetMentorPassword/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
      } else {
        return res.status(200).json({ success: true, message: "Password Changed" });
      }
    });
  });
};

const updatePassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const generatedSalt = await bycrypt.genSalt(10);

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" });
    } else {
      bycrypt
        .hash(password, generatedSalt)
        .then((hash) => {
          Mentor.findByIdAndUpdate({ _id: id }, { password: hash })
            .then((u) => res.json({ success: true }))
            .catch((err) => res.json({ success: false }));
        })
        .catch((err) => res.send({ success: false, message: err }));
    }
  });
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
