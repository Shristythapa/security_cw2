const Mentor = require("../model/mentor");
const Session = require("../model/session");
const { format, parseISO } = require("date-fns");

const createSession = async (req, res) => {

  const {
    mentorId,
    mentor: { name: mentorName, email: mentorEmail },
    title,
    description,
    date,
    startTime,
    endTime,
  } = req.body;

  console.log(mentorEmail, mentorName, title);

  if (
    !mentorId ||
    !mentorName ||
    !mentorEmail ||
    !title ||
    !description ||
    !date ||
    !startTime ||
    !endTime 
  ) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
  }

  try {


    const newSession = new Session({
      mentorId: mentorId,
      mentor: { name: mentorName, email: mentorEmail },
      title: title,
      description: description,
      date: format(parseISO(date), "yyyy-MM-dd"),
      startTime: startTime,
      endTime: endTime,
    });

    await newSession.save();
    res.status(200).json({
      success: true,
      message: "Session created sucessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAllSessions = async (req, res) => {
  try {
    const listOfSessions = await Session.find({});

    res.status(200).json({
      success: true,
      sessions: listOfSessions,
      message: "Sessions accquired",
      count: listOfSessions.length,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json("Server error");
  }
};
const joinSession = async (req, res) => {
  const { menteeEmail, menteeId } = req.body;
  const id = req.params.id;

  console.log(menteeEmail, "joining session...");

  if (!menteeEmail || !menteeId) {
    return res.status(400).json({
      success: false,
      message: "Invalid Mentee",
    });
  }

  try {
    let session = await Session.findById(id);

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (session.attendeeSigned && session.attendeeSigned.menteeId) {
      return res.status(400).json({
        success: false,
        message: "Session already has an attendee",
      });
    }

    session.attendeeSigned = {
      menteeId: menteeId,
      email: menteeEmail,
    };

    const updatedSession = await session.save();

    console.log("Session joined");
    return res.status(200).json({
      success: true,
      message: "Session updated successfully",
      session: updatedSession,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


const getSessionById = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Session Id required",
    });
  }

  try {
    const session = await Session.findById(id);
    console.log("session by id found");
    if (session) {
      console.log(session);
      return res.status(200).json({
        success: true,
        message: "Session send",
        session: session,
      });
    }
    console.log("session by id not found");
    return res.stauts(400).json({
      success: false,
      message: "Session Not Valid",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const deleteSessions = async (req, res) => {
  try {
    const deletedSession = await Session.findByIdAndDelete(req.params.id);

    if (!deletedSession) {
      res.status(400).json({
        message: "Session not found",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      message: "Session deleted sucessfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Server error",
      succes: false,
    });
  }
};
const getSessionsByMentorId = async (req, res) => {
  try {
    console.log("mentor id for session", req.params.id);

    const mentorSessions = await Session.find({ mentorId: req.params.id });

    res.status(200).json({
      message: "retrived",
      success: true,
      sessions: mentorSessions,
      count: mentorSessions.length,
    });
  } catch (e) {
    res.status(400).json({
      message: "error",
      success: false,
    });
  }
};

const startSession = async (req, res) => {
  console.log("session startedddd");
  const id = req.params.id;

  try {
    const updatedSession = await Session.findByIdAndUpdate(
      id,
      { $set: { isOngoing: true } },
      { new: true }
    );

    if (!updatedSession) {
      console.log("Session not found");
      return res.status(400).json({
        message: "Session not found",
        success: false,
      });
    }

    console.log("Session updated:", updatedSession);
    return res.status(200).json({
      message: "Session ongoing",
      success: true,
    });
  } catch (e) {
    console.error("Error updating document:", e);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const endCall = async (req, res) => {
  console.log("call end route resched");
  console.log("session ended");
  const id = req.params.id;

  try {
    const updatedSession = await Session.findByIdAndUpdate(
      id,
      { $set: { isOngoing: false } },
      { new: true }
    );

    if (!updatedSession) {
      console.log("Session not found");
      return res.status(400).json({
        message: "Session not found",
        success: false,
      });
    }

    console.log("Session updated:", updatedSession);
    return res.status(200).json({
      message: "Session ongoing",
      success: true,
    });
  } catch (e) {
    console.error("Error updating document:", e);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

module.exports = {
  createSession,
  getAllSessions,
  deleteSessions,
  getSessionById,
  joinSession,
  getSessionsByMentorId,
  startSession,
  endCall,
};
