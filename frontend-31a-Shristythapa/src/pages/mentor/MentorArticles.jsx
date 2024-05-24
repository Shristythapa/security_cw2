import React, { useEffect, useState } from "react";

import {
  createArticle,
  deleteArticel,
  findMentorByEmail,
  getAllArticle,
} from "../../Api/Api";
import { toast } from "react-toastify";
import FloatingActionButton from "../../components/FloatingActionButton";
import Article from "../../components/Article";
import ArticleMentor from "../../components/ArticleMentor";

const MentorArticles = () => {
  const fabStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "purple",
    color: "white",
  };

  const mentor = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("Why Is Web Design Important?");
  const [description, setDescription] = useState(" As you look into redesigning your website, you may wonder the importance to website design. How does it impact your audience and your business? Let’s look at five reasons web design is important. It sets the first impression When your audience visits your website, it gives them their first impression of your business. They will judge your business within seconds. In these first few seconds, you want to make a positive impact on your audience. If your website looks unappealing or outdated, your audience will immediately have a negative impression of your business. They won’t find your website appealing, which deters them from your page. You’ll miss out on leads because they’ll leave your page for a competitor’s page. Web design is important because it impacts how your audience perceives your brand. The impression you make on them can either get them to remain on your page and learn about your business or leave your page and turn to a competitor. A good web design helps you keep your leads on your page.");
  const [isMyArticles, setIsMyArticles] = useState(false);
  const [articles, setArticles] = useState([]);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const handleCreateArticle = async (e) => {
    e.preventDefault();

    const res = await findMentorByEmail(mentor.email);
    if (res.data.success == false) {
      console.log(res);
      return toast.error(res.data.message);
    }
    console.log(res);
    const foundMentor = res.data.mentor;

    if (
      !foundMentor._id ||
      !foundMentor.name ||
      !foundMentor.email ||
      !title ||
      !description
    ) {
      return toast.error("Enter all feilds");
    }
    const data = {
      mentorId: foundMentor._id,
      title: title,
      body: description,
      mentorName:
        foundMentor.mentorProfileInformation.firstName +
        " " +
        foundMentor.mentorProfileInformation.lastName,
      mentorEmail: foundMentor.email,
      profileUrl: foundMentor.profileUrl,
    };
    console.log(data);
    createArticle(data)
      .then((res) => {
        if (res.data.success == false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          getAllArticle().then((res) => {
            setArticles(res.data.articles);
          });
          setShowArticleModal(false);
        }
      })
      .catch((err) => {
        toast.error("Server error");
        console.log(err.message);
      });
    getAllArticle().then((res) => {
      setArticles(res.data.articles);
    });
    setShowArticleModal(false);
  };
  const handleDeleteArticle = (id) => {
    deleteArticel(id).then((res) => {
      console.log("Article deleted:", id);

      if (res.data.success == true) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }

      getAllArticle().then((res) => {
        setArticles(res.data.articles);
      });
      setShowArticleModal(false);
    });
  };
  const [selectedArticle, setSelectedArticle] = useState(null);
  const handleCloseModal = () => {
    setShowArticleModal(false);
  };
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setShowArticleModal(true);
  };
  const handleToggle = () => {
    setIsMyArticles((prev) => !prev);
  };
  useEffect(() => {
    console.log("run use effect");

    const fetchData = async () => {
      try {
        const res = await getAllArticle();
        console.log(res);

        // Filter articles based on the condition
        const filteredArticles = isMyArticles
          ? res.data.articles.filter(
              (article) => article.mentorEmail === mentor.email
            )
          : res.data.articles;

        setArticles(filteredArticles);
        console.log(filteredArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchData();
  }, [isMyArticles, mentor.email]);

  return (
    <div
      className="col py-3"
      style={{ backgroundColor: "#f7f8fc", color: "#EEA025" }}
    >
      <div className="container m-1">
        {/* <div className="mb-5 mt-2 border-0">
            <form className="form-inline my-2 my-lg-0 container ">
              <div className="row">
                <div className="col-md-10">
                  <input
                    className="form-control w-100 shadow-sm border-0"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                </div>
                <div className="col-md-2 mt-2 mt-md-0">
                  <button
                    className="btn w-100 shadow-sm"
                    style={{ backgroundColor: "#C48EEA", color: "#fff" }}
                    type="submit"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div> */}
        <div className="container mb-4">
          <div className="row">
            <header>
              <h4
                style={{
                  color: "#EEA025",
                  fontSize: "28px",
                  fontWeight: "bolder",
                }}
              >
                {isMyArticles ? "My Articles" : "All Articles"}
              </h4>
              <button
                onClick={handleToggle}
                style={{
                  padding: "5px",
                  margin: "5px",
                  backgroundColor: "#EEA025",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {isMyArticles ? "Show All Articles" : "Show My Articles"}
              </button>
            </header>
          </div>

          <div className="col-2 text-end"></div>
        </div>

        <div className="col-lg-12">
          <div className="row">
            {articles.map((article) => (
              <ArticleMentor
                article={article}
                handleArticleClick={handleArticleClick}
              ></ArticleMentor>
            ))}
            {showArticleModal && (
              <div
                className="modal fade show"
                style={{ display: "block" }}
                tabIndex="-1"
                role="dialog"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{selectedArticle.title}</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={handleCloseModal}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <p style={{ color: "#000000" }}>{selectedArticle.body}</p>
                    </div>
                    <div className="modal-footer">
                      {isMyArticles && (
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => {
                            handleDeleteArticle(selectedArticle._id);
                          }}
                        >
                          Delete
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCloseModal}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <FloatingActionButton>+</FloatingActionButton>
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
                      Mentor
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
                      <label className="form-">Article Title</label>
                      <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        className="form-control mb-2"
                        placeholder="Enter Article title"
                      ></input>
                      {/* discription */}
                      <label for="exampleFormControlTextarea1">
                        Description
                      </label>
                      <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        class="form-control"
                        id="exampleFormControlTextarea1"
                        rows="5"
                        placeholder="Enter Description"
                      ></textarea>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn"
                      data-bs-dismiss="modal"
                      style={{
                        backgroundColor: "#C48EEA",
                        color: "#fff",
                      }}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateArticle}
                      className="btn"
                      style={{
                        backgroundColor: "#772C91",
                        color: "#fff",
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorArticles;
