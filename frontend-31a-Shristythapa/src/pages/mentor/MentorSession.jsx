import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import {
  createSessionApi,
  findMentorByEmail,
  getSessionsOfMentor,
  startCall,
} from "../../Api/Api";
import { toast } from "react-toastify";
import { Card, Modal } from "react-bootstrap";
import { deleteSessionApi } from "../../Api/Api";
import { format, parseISO } from "date-fns";
import { useUser } from "../../context/UserContext";
import { sanitizeInput } from "../../components/sanitizeInput";

const MentorSessions = () => {
  const navigate = useNavigate();
  const user = useUser();

  // const [mentorId, setMentorId ] = useState(null);
  const [title, setTitle] = useState(
    " How to start a successful web design business"
  );
  const [description, setDiscription] = useState(
    " From setting up your workspace, to drafting a business plan, to crafting your brand — it's all in there. These insights come from real-life pros who've been there and done that. It's a roadmap that guides you toward a booming web design business."
  );
  const [selectedDate, setSelectedDate] = useState(new Date(2023, 4, 4));

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (sessionId) => {
    setSelectedSessionId(sessionId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedSessionId(null);
    setShowModal(false);
  };

  // create session function
  const handleCreateSession = async (e) => {
    e.preventDefault();

    const formateDate = new Date(sanitizeInput(selectedDate));

    const res = await findMentorByEmail(user.email);
    if (res.data.success == false) {
      return toast.error(res.data.message);
    }
    const foundMentor = res.data.mentor;

    if (
      (!foundMentor._id,
      !foundMentor.name ||
        !foundMentor.email ||
        !title ||
        !description ||
        !selectedDate ||
        !startTime ||
        !endTime)
    ) {
      return toast.error("Enter all feilds");
    }

    // const sanitizedTitle = sanitizeInput(title);
    const sanitizedDescription = sanitizeInput(description);
    const sanitizedStartTime = sanitizeInput(startTime);
    const sanitizedEndTime = sanitizeInput(endTime);

    const data = {
      mentorId: foundMentor._id,
      mentor: {
        name: foundMentor.name,
        email: foundMentor.email,
      },
      title: title,
      description: sanitizedDescription,
      date: formateDate.toISOString().split("T")[0],
      startTime: sanitizedStartTime,
      endTime: sanitizedEndTime,
    };

    createSessionApi(data)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        // toast.error("Server error");
        toast.error(err.response.data.message);
        console.log(err.message);
      });
    getSessions();
    handleCloseModal();
  };

  const [sessions, setSessions] = useState([]);

  const getSessions = () => {
    console.log(user);
    const myEmail = user.email;
    findMentorByEmail(myEmail).then((mentorResponse) => {
      const mentorId = mentorResponse.data.mentor._id;

      getSessionsOfMentor(mentorId).then((res) => {
        setSessions(res.data.sessions);
      });
    });
  };

  useEffect(() => {
    getSessions();
  }, []);

  const handleDelete = (id) => {
    const confirmDialog = window.confirm(
      "Are you sure you want to delete this Session?"
    );
    if (!confirmDialog) {
      return;
    } else {
      deleteSessionApi(id).then((res) => {
        if (res.data.success == true) {
          toast.success(res.data.message);
          // window.location.reload();
        } else {
          // toast.error(res.data.message);
        }
      });
    }
    getSessions();
  };

  const getStatus = (sessionDate) => {
    const currentDate = new Date();
    const sessionDateTime = new Date(sessionDate);

    return sessionDateTime > currentDate ? "Upcoming" : "Completed";
  };

  const SessionModal = ({ session }) => (
    <Modal
      show={showModal && session._id === selectedSessionId}
      onHide={handleCloseModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>{session.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Title: {session.title}</p>
        <p>Description: {session.description}</p>
        <p>Date: {format(parseISO(session.date), "yyyy-MM-dd")}</p>
        <p>Start Time: {session.startTime}</p>
        <p>End Time: {session.endTime}</p>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={handleCloseModal}>
          Close
        </button>

        <button
          className="btn btn-danger"
          type="submit"
          // style={{ backgroundColor: "#772C91", color: "#fff" }}
          onClick={() => handleDelete(session._id)}
        >
          Delete
        </button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <>
      <div className="m-4">
        <div className="d-flex justify-content-between">
          <h2
            style={{ color: "#EEA025", fontSize: "28px", fontWeight: "bolder" }}
          >
            Your Sessions
          </h2>
          {/* <video ref={userVideoRef} autoPlay muted></video> */}
          <button
            type="button"
            className="btn "
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            style={{ backgroundColor: "#EEA025", color: "#fff" }}
          >
            Add Sesion
          </button>

          <div
            className="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Create new session
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    {/* title */}
                    <label className="form-">Session title</label>
                    <input
                      onChange={(e) => setTitle(e.target.value)}
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter Session title"
                    ></input>
                    {/* discription */}
                    <br></br>
                    <label className="form-label">Session description</label>
                    <input
                      onChange={(e) => setDiscription(e.target.value)}
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter Session description"
                    ></input>

                    {/* date */}
                    <br></br>
                    <label className="form-label">Session date</label>
                    <input
                      onChange={(e) => setSelectedDate(e.target.value)}
                      type="date"
                      className="form-control mb-2"
                      min={new Date().toISOString().split("T")[0]} // Set the minimum date to the current date
                    />

                    {/* start time */}
                    <br></br>
                    <label className="form-label">Select start time</label>
                    <input
                      onChange={(e) => setStartTime(e.target.value)}
                      type="time"
                      className="form-control mb-2"
                    />

                    {/* end time */}
                    <br></br>
                    <label className="form-label">Select end time</label>
                    <input
                      onChange={(e) => setEndTime(e.target.value)}
                      type="time"
                      className="form-control mb-2"
                    />
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn"
                    data-bs-dismiss="modal"
                    style={{ backgroundColor: "#C48EEA", color: "#fff" }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateSession}
                    className="btn"
                    style={{ backgroundColor: "#772C91", color: "#fff" }}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container m-1">
        <div className="row">
          {sessions.map((session) => (
            <div key={session.id} className="col-lg-6 col-md-4 col-sm-12 mb-4">
              <Card
                className="rounded-7 p-4"
                style={{
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
                  border: "none",
                }}
              >
                <Card.Body>
                  <div
                    className="container d-flex "
                    style={{ justifyContent: "space-between" }}
                  >
                    <Card.Title>{session.title}</Card.Title>

                    <span
                      className={`mr-2 text-${
                        getStatus(session.date) === "Upcoming"
                          ? "success"
                          : "danger"
                      }`}
                    >
                      {getStatus(session.date)}
                    </span>
                  </div>

                  <hr />
                  <Card.Subtitle className="mb-2 text-muted">
                    {session.description}
                  </Card.Subtitle>

                  <div className="d-flex align-items-center"></div>

                  <button
                    // style={{ backgroundColor: "#EEA025", color: "#fff" }}
                    // variant="primary"
                    className="mt-3 btn"
                    onClick={() => handleShowModal(session._id)}
                    style={{ backgroundColor: "#772C91", color: "#fff" }}
                  >
                    View Session
                  </button>
                  <SessionModal session={session} />
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MentorSessions;
