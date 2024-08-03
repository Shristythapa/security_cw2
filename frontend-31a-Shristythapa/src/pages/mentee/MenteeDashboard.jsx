import { Outlet, Navigate } from "react-router-dom";
import MenteeNavbar from "./MenteeNavbar";
import io from "socket.io-client"; // Import socket.io-client
import { getSessionById } from "../../Api/Api";
import { React, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { UserProvider } from "../../context/UserContext";
import { useState } from "react";
import axios from "axios";
const MenteeDashboard = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          "https://localhost:5000/api/validate",
          {},
          { withCredentials: true }
        );

        if (response.data.valid) {
          setIsAuthenticated(true);
          setIsMentor(response.data.user.isMentor);
        }
      } catch (error) {
        console.error("Failed to validate token:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const socket = io("https://localhost:5000");

    socket.on("mentor-join", async (ROOM_ID) => {
      const session = await getSessionById(ROOM_ID);
      console.log(session);
      console.log("session started");
      window.location.reload();

      setTimeout(function () {
        toast.success("Session started");
      }, 2000);
    });

    socket.on("user-disconnected", (userId) => {
      toast.warn(`${userId} has left the room.`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isMentor) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <UserProvider user={user}>
        <div className="container-fluid" style={{ width: "100vw" }}>
          <div className="row">
            {/* Navbar */}
            <MenteeNavbar></MenteeNavbar>
          </div>

          {/* Main content */}
          <div
            className="row"
            style={{
              color: "#EEA025",
              minWidth: "100vw",
              minHeight: "100vh",
              backgroundColor: "#F7F8FC",
            }}
          >
            <div className="col">
              <Outlet></Outlet>
            </div>
          </div>
        </div>
      </UserProvider>
    </>
  );
};

export default MenteeDashboard;
