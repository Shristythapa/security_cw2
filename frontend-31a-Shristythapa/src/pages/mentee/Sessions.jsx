import { React, useState, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { getAllSessionsApi, joinSession, startCall } from "../../Api/Api";
import "../../assets/css/start.css";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

const Sessions = () => {
  const mentee = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
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

  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // turnOffCamera();
    getAllSessionsApi().then((res) => {
      setSessions(res.data.sessions);
      console.log(res.data.sessions);
    });
  }, []);

  // Function to turn off the camera
  function turnOffCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const videoTracks = stream.getVideoTracks();

        // If there are video tracks (camera is on)
        if (videoTracks.length > 0) {
          // Stop the camera by requesting access to an empty media stream
          navigator.mediaDevices
            .getUserMedia({ video: false })
            .then(() => {
              console.log("Camera turned off.");
            })
            .catch((error) => {
              console.error(
                "Error turning off camera:",
                error.response.data.message
              );
            });
        } else {
          console.log("Camera is already off.");
        }
      })
      .catch((error) => {
        console.error("Error accessing camera:", error.response.data.message);
      });
  }

  const getStatus = (sessionDate) => {
    const currentDate = new Date();

    try {
      const sessionDateTime = new Date(sessionDate);

      if (isNaN(sessionDateTime)) {
        throw new Error("Invalid date format");
      }

      return sessionDateTime > currentDate ? "Upcoming" : "Completed";
    } catch (error) {
      console.error(`Error parsing date: ${error.message}`);
      return "Error";
    }
  };

  const registerToSession = async (id, data) => {
    console.log("session id: ", id);
    if (!mentee) {
      toast.error("Mentee No valid");
      handleCloseModal();
      return;
    }

    joinSession(id, data)
      .then((res) => {
        if (res.data && res.data.success === true) {
          window.location.reload();
          toast.success(res.data.message);
          return;
        } else if (res.data && res.data?.success === false) {
          toast.error(res.data.message);
          return;
        } else {
          // Handle other cases if needed
          toast.error("Unexpected response format");
          return;
        }
      })
      .catch((error) => {
        console.error("Error joining session:", error.message);
        toast.error("Error joining session. Please try again.");
        return;
      });
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
        <p>Date: {format(parseISO(session.date), "yyyy-MM-dd")}</p>
        <p>
          Time: {session.startTime} to {session.endTime}{" "}
        </p>

        <p>Mentor: {session.mentor.name}</p>

        <p>Description: {session.description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <div
      className="container m-3 p-3 "
      style={{ maxWidth: "100vw", backgroundColor: "#F7F8FC" }}
    >
      <h2 style={{ color: "#EEA025", fontSize: "28px", fontWeight: "bolder" }}>
        Sessions
      </h2>
      <div className="row">
        {sessions.map((session) => (
          <div key={session.id} className="col-md-4 mb-4 ">
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
                  <Card.Title className="text-truncate">
                    {session.title}
                  </Card.Title>

                  <span
                    className={`mr-2  text-${
                      getStatus(session.date) === "Upcoming"
                        ? "success font-weight-bold font-italic"
                        : "danger font-weight-bold font-italic"
                    }`}
                  >
                    {getStatus(session.date)}
                  </span>
                </div>

                <hr />
                <Card.Subtitle className="mb-2 text-muted text-truncate">
                  {session.description}
                </Card.Subtitle>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: session.isOngoing
                        ? "space-between"
                        : "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <button
                      className="mt-3 btn"
                      onClick={() => handleShowModal(session._id)}
                      style={{ backgroundColor: "#772C91", color: "#fff" }}
                    >
                      View Session
                    </button>
                  </div>
                </div>

                <SessionModal session={session} />
              </Card.Body>
            </Card>
          </div>
          ///
        ))}
      </div>
    </div>
  );
};

export default Sessions;
