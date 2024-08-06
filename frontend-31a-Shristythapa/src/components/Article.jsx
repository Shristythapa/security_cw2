import { React, useState, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const Article = ({ article, handleArticleClick }) => {
  const navigate = useNavigate();
  const viewMentor = (id) => {
    navigate(`/mentorPublicProfileForMentee/${id}`, {
      state: id,
    });
  };

  return (
    <div key={article.id} className="col-md-6 col-sm-12 mb-6 col-lg-6 mb-5">
      <Card
        className="rounded-7 p-4"
        style={{
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
          border: "none",
          // maxHeight: "200px",
          cursor: "pointer",
        }}
        onClick={() => handleArticleClick(article)}
      >
        <Card.Body>
          <div className="container">
            <div className="row align-items-center justify-content-between">
              <div
                className="col col-sm-5"
                onClick={() => {
                  viewMentor(article.mentorId);
                }}
              >
                {" "}
                {/* Use "col-auto" to adjust the column width based on content */}
                <img
                  className="rounded-circle img-fluid mx-auto m-3"
                  src={article.profileUrl}
                  alt="Profile"
                  style={{ width: "70px", height: "70px" }}
                />
                <div className="text-dark fw-bold">{article.mentorName}</div>
                <div className="text-dark fw-normal">{article.mentorEmail}</div>
              </div>

              <br></br>

              <div className="col-sm-7 align-items-start">
                {" "}
                {/* Use "col" to allow the column to take up remaining space */}
                <Card.Title
                  className="text-truncate"
                  style={{ whiteSpace: "pre-wrap", fontWeight: "bold" }}
                >
                  {article.title}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted text-truncate">
                  {article.body}
                </Card.Subtitle>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Article;
