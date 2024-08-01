import { Outlet } from "react-router-dom";
import MenteeNavbar from "./MenteeNavbar";
import io from "socket.io-client"; // Import socket.io-client
import { getSessionById } from "../../Api/Api";
import { React, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { UserProvider } from "../../context/UserContext";
const MenteeDashboard = () => {
 
  const location = useLocation();
  const { user } = location.state || {};

  useEffect(() => {
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
