import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/adminDashboard.css"; // Import the CSS file
import { getAllMenteeLogs, getAllMentorLogs } from "../../Api/Api";
const Card = ({ imageUrl, username }) => (
  <div className="card mb-3 shadow-sm">
    {" "}
    {/* Added shadow class */}
    <div className="card-body d-flex align-items-center justify-content-between">
      <img src={imageUrl} alt={username} className="profile-pic" />
      <div>
        <h5 className="card-title mb-0">{username}</h5>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [menteLogs, setMenteeLogs] = useState([]);
  const [mentorLogs, setMentorLogs] = useState([]);

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
  }, []);

  return (
    <div className="container-fluid p-4">
      <div className="row vh-100">
        <div className="col-6 scrollable-list">
          <h1 className="text-center mb-4">Mentees</h1>
          {menteLogs.map((card, index) => (
            <Card
              key={index}
              imageUrl={card.menteeId.profileUrl}
              username={card.menteeId.name}
            />
          ))}
        </div>
        <div className="col-6 scrollable-list">
          <h1 className="text-center mb-4">Mentors</h1>
          {mentorLogs.map((card, index) => (
            <Card
              key={index}
              imageUrl={card.mentorId.profileUrl}
              username={card.mentorId.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
