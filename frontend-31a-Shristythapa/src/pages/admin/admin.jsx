import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/adminDashboard.css"; // Import the CSS file
import { getAllMenteeLogs, getAllMentorLogs } from "../../Api/Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar, Nav, Container } from "react-bootstrap";
import { logout } from "../../Api/Api";
const Card = ({ imageUrl, username, onClick }) => (
  <div className="card mb-3 shadow-sm" onClick={onClick}>
    {" "}
    {/* Attach onClick here */}
    <div className="card-body d-flex align-items-center justify-content-between">
      <img src={imageUrl} alt={username} className="profile-pic" />
      <div>
        <h5 className="card-title mb-0">{username}</h5>
      </div>
    </div>
  </div>
);

const Admin = () => {
  const navigate = useNavigate();
  const [menteLogs, setMenteeLogs] = useState([]);
  const [mentorLogs, setMentorLogs] = useState([]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMenteeLogs().then((res) => {
      console.log(res);
      if (!res.data.success) {
        console.log(res.data.message);
        console.log("no data");
      } else {
        console.log(res.data);
        setMenteeLogs(res.data.menteeLogs);
      }
    });
    getAllMentorLogs().then((res) => {
      console.log(res);
      if (!res.data.success) {
        console.log(res.data.message);
        console.log("no data");
      } else {
        console.log(res.data);
        setMentorLogs(res.data.mentorLogs);
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

  const viewMentor = (data) => {
    console.log(data);
    navigate(`/mentorLog/${data._id}`, {
      state: data._id,
    });
  };

  const viewMentee = (data) => {
    console.log(data);
    navigate(`/menteeLog/${data._id}`, {
      state: data._id,
    });
  };

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

      <div className="container-fluid p-4">
        <div className="row vh-100 justify-content-center">
          <div className="col-10 col-md-4 scrollable-list">
            <h3 className="text-center mb-3">Mentees</h3>
            {menteLogs.map((card, index) => (
              <Card
                key={index}
                imageUrl={card.menteeId.profileUrl}
                username={card.menteeId.name}
                onClick={() => viewMentee(card)}
              />
            ))}
          </div>
          <div className="col-10 col-md-4 scrollable-list">
            <h3 className="text-center mb-1">Mentors</h3>
            {mentorLogs.map((card, index) => (
              <Card
                key={index}
                imageUrl={card.mentorId.profileUrl}
                username={card.mentorId.name}
                onClick={() => viewMentor(card)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
