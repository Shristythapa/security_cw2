import axios from "axios";
import session_mock from "../mocks/session_mock";
import mentor_login_mock from "../mocks/mentor_login_mock";
import mentee_login_mock from "../mocks/mentee_login_mock";
import article_mock from "../mocks/article_mock";
import article_list_mock from "../mocks/article_list_mock";
import session_by_mentor_id_mock from "../mocks/session_by_mentor_id_mock";
import mentor_list_mock from "../mocks/mentor_list_mock";

const baseUrl = "http://localhost:5000";

describe("API Testing", () => {
  it("Test Should Work", async () => {
    const response = await axios.get(`${baseUrl}/test`);
    expect(response.status).toEqual(200);
  });

  // 1. mentee login
  it(" Mentee login should work", async () => {
    const response = await axios.post(
      `${baseUrl}/api/mentee/login`,
      mentor_login_mock
    );
    expect(response.status).toEqual(200);
    expect(response.data.message).toEqual("User loged in Sucessfully");
  });

  // 2. mentor login
  it(" mentor login should work", async () => {
    const response = await axios.post(
      `${baseUrl}/api/mentor/login`,
      mentor_login_mock
    );
    expect(response.status).toEqual(200);
    expect(response.data.message).toEqual("User loged in successfully");
  });

  // 3. fetch article  -- change mock with change in database
  it("Fetch all Article", async () => {
    const response = await axios.get(`${baseUrl}/api/article/findAllArticles`);

    expect(response.status).toEqual(200);
    expect(response.data.articles).toBeDefined();
  });

  // 4. fetch session -- change mock with change in database
  it("Fetch all Sessions", async () => {
    const response = await axios.get(`${baseUrl}/api/session/getAllSessions`);

    expect(response.status).toEqual(200);
    expect(response.data.sessions).toBeDefined();
  });

  // 5. fetch mentors -- change mock with change in database
  it("Fetch all Mentors", async () => {
    const response = await axios.get(`${baseUrl}/api/mentor/getAllMentors`);

    expect(response.status).toEqual(200);
    expect(response.data.mentors).toBeDefined();
  });

  // 6. fetch session by mentor id -- change mock with change in database
  it("Fetch all Session by mentor id", async () => {
    const response = await axios.get(
      `${baseUrl}/api/session/mentorSessions/65e03e306c3ae053a05343e5`
    );

    expect(response.status).toEqual(200);
    expect(response.data.sessions).toBeDefined();
  });

  // 7. fetch mentor by Id
  it("Fetch Mentor ID", async () => {
    const response = await axios.get(
      `${baseUrl}/api/mentor/getMentorById/65e03e306c3ae053a05343e5`
    );

    expect(response.status).toEqual(200);
    expect(response.data.mentor).toBeDefined();
  });

  // 8. add article
  it("Testing Add Article", async () => {
    const response = await axios.post(
      `${baseUrl}/api/article/createArticle`,
      article_mock
    );
    if (response.data.success) {
      expect(response.status).toEqual(200);
      expect(response.data.message).toEqual("Article created sucessfully");
    }
  });

  // 9. delete article
  it("Testing Delete Article", async () => {
    const response = await axios.delete(
      `${baseUrl}/api/article/deleteArticle/65e194e5b5cc674935a01e7b`
    );
    if (response.data.success) {
      expect(response.status).toEqual(200);
      expect(response.data.message).toEqual("Article deleted");
    }
  });

  //10. join --note same mentee can't be added to same session twice
  it("Testing Join Session ", async () => {
    const response = await axios.put(
      `${baseUrl}/api/session/joinSession/65e03eff6c3ae053a05343ee`,
      {
        menteeId: "65add92556f23d2064722fe3",
        menteeEmail: "mentor@example.com",
      }
    );
    if (response.data.success) {
      expect(response.status).toEqual(200);
      expect(response.data.message).toEqual("Session updated successfully");
    }
  });
});
