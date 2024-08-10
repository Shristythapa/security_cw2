import React, { useEffect, useState } from "react";
import { getMentorLogById } from "../../Api/Api";
import "../../assets/css/adminDashboard.css";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MentorLog = () => {
    const location = useLocation();
  const id = location.state;
  const [mentorLog, setMentorLog] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    getMentorLogById(id).then((res) => {
      console.log(id)
      if (res.data && res.data.success == true) {
        setMentorLog(res.data.mentorLog);
      } else if (res.data && res.data?.success === false) {
        toast.error(res.data.message);
        navigate("/admin");
        return;
      } else {
        toast.error("Unexpected response format");
        navigate("/admin");
        return;
      }
    });
  }, []);

  if (!mentorLog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="font-weight-bold">Activity Logs</h3>
        <div className="d-flex align-items-center">
          <img
            src={mentorLog.mentorId.profileUrl}
            alt="Mentor"
            className="profile-pic"
          />
          <div className="ml-3">
            <div className="mentor-label">Mentor</div>
            <div className="mentor-name font-weight-bold">
              {mentorLog.mentorId.name}
            </div>
          </div>
        </div>
      </div>

      <table className="table table-hover table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Logins</th>
            <th>Logouts</th>
            <th>Change Passwords</th>
          </tr>
        </thead>
        <tbody>
          {mentorLog.logins.length > 0 ? (
            mentorLog.logins.map((login, idx) => (
              <tr key={idx}>
                <td>
                  <div className="d-flex justify-content-between">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Login Time</Tooltip>}
                    >
                      <span className="font-weight-bold tooltip-trigger">
                        <i className="fas fa-sign-in-alt"></i>{" "}
                        {new Date(login.time).toLocaleString()}
                      </span>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Failed Attempts</Tooltip>}
                    >
                      <span className="font-weight-bold text-danger tooltip-trigger">
                        {login.failedAttempts}
                      </span>
                    </OverlayTrigger>
                  </div>
                </td>
                <td colSpan="2"></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No login records
              </td>
            </tr>
          )}
          {mentorLog.logouts.length > 0 ? (
            mentorLog.logouts.map((logout, idx) => (
              <tr key={idx}>
                <td colSpan="1"></td>
                <td>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Logout Time</Tooltip>}
                  >
                    <div className="font-weight-bold tooltip-trigger">
                      <i className="fas fa-sign-out-alt"></i>{" "}
                      {new Date(logout).toLocaleString()}
                    </div>
                  </OverlayTrigger>
                </td>
                <td colSpan="1"></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No logout records
              </td>
            </tr>
          )}
          {mentorLog.forgotPassword.length > 0 ? (
            mentorLog.forgotPassword.map((passwordChange, idx) => (
              <tr key={idx}>
                <td colSpan="2"></td>
                <td>
                  <div className="font-weight-bold">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Password Request Time</Tooltip>}
                    >
                      <div className="tooltip-trigger">
                        <i className="fas fa-key"></i> Request Time:{" "}
                        {new Date(passwordChange.requestTime).toLocaleString()}
                      </div>
                    </OverlayTrigger>
                    {passwordChange.changedTime && (
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Password Changed Time</Tooltip>}
                      >
                        <div className="tooltip-trigger">
                          <i className="fas fa-clock"></i> Changed Time:{" "}
                          {new Date(
                            passwordChange.changedTime
                          ).toLocaleString()}
                        </div>
                      </OverlayTrigger>
                    )}
                    {passwordChange.gapTime && (
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Gap Time</Tooltip>}
                      >
                        <div className="tooltip-trigger">
                          <i className="fas fa-hourglass-half"></i> Gap Time:{" "}
                          {Math.floor(passwordChange.gapTime / 60000)} min
                        </div>
                      </OverlayTrigger>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No password change records
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MentorLog;
