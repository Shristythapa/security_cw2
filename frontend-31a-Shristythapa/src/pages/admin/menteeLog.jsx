import React, { useEffect, useState } from "react";
import { getMenteeLogById } from "../../Api/Api";
import "../../assets/css/adminDashboard.css";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Navbar, Nav, Container } from "react-bootstrap";
import { logout } from "../../Api/Api";
const MenteeLog = () => {
  const location = useLocation();
  const id = location.state;
  const [menteeLog, setMenteeLog] = useState(null);
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getMenteeLogById(id).then((res) => {
      console.log(id);
      console.log(res);
      if (res.data && res.data.success == true) {
        console.log(res.data.menteeLog);
        setMenteeLog(res.data.menteeLog);
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
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          "https://localhost:5000/api/validate",
          {},
          { withCredentials: true }
        );
        console.log(response);

        if (response.data.valid) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          if (response.data.user.isAdmin) {
            setIsAdmin(response.data.user.isAdmin);
          }
        }
      } catch (error) {
        console.error("Failed to validate token:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return navigate("/login");
  }

  if (!isAdmin) {
    return navigate("/login");
  }
  const handleLogout = async (e) => {
    e.preventDefault();
    // await logout();
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="light" variant="light" expand="lg">
        {/* Leftmost: Admin Dashboard Link */}
        <Navbar.Brand href="/adminDashboard">
          <h2 style={{ fontWeight: "900" }}>Admin Dashboard</h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Push Logout button to the right */}
          <Nav className="ms-auto">
            <Container>
              {" "}
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Container>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="font-weight-bold">Activity Logs</h3>
          <div className="d-flex align-items-center">
            <img
              src={menteeLog.menteeId.profileUrl}
              alt="Mentor"
              className="profile-pic"
            />
            <div className="ml-3">
              <div className="mentor-label">Mentee</div>
              <div className="mentor-name font-weight-bold">
                {menteeLog.menteeId.name}
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
            {menteeLog.logins.length > 0 ? (
              menteeLog.logins.map((login, idx) => (
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
                  <td></td>
                  <td></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No login records
                </td>
              </tr>
            )}
            {menteeLog.logouts.length > 0 ? (
              menteeLog.logouts.map((logout, idx) => (
                <tr key={idx}>
                  <td></td>
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
                  <td></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No logout records
                </td>
              </tr>
            )}
            {menteeLog.forgotPassword.length > 0 ? (
              menteeLog.forgotPassword.map((passwordChange, idx) => (
                <tr key={idx}>
                  <td></td>
                  <td></td>
                  <td>
                    <div className="font-weight-bold">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Password Request Time</Tooltip>}
                      >
                        <div className="tooltip-trigger">
                          <i className="fas fa-key"></i> Request Time:{" "}
                          {new Date(
                            passwordChange.requestTime
                          ).toLocaleString()}
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
    </>
  );
};

export default MenteeLog;
