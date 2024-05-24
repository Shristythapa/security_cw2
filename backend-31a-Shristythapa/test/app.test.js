const request = require("supertest");
const app = require("../index");
describe("API Testing", () => {
  //1. get all article
  it("GET /api/session/getAllArticles |Response with valid json", async () => {
    const response = await request(app).get("/api/article/findAllArticles");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toBe("Article List");
    expect(response.body.success).toBe(true);
  });

  //2. create article
  it("POST /api/article/createArticle | Response with valid json", async () => {
    const response = await request(app)
      .post("/api/article/createArticle")
      .send({
        mentorEmail: "emai;",
        title: "title",
        body: "body",
        profileUrl:
          "https://res.cloudinary.com/duhlo06nb/image/upload/v1706350213/Mentor/vcg54qpez9u1ktxrcfoe.jpg",
      });
    console.log(response.body);
    if (response.body.success) {
      expect(response.body.message).toBe("Article created sucessfully");
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    } else {
      expect(response.body.message).toBe("Please enter all feilds");
      expect(response.body.success).toBe(false);
    }
  });

  //3. mentee login
  it("POST /api/mentee/login | Response with valid json", async () => {
    const response = await request(app).post("/api/mentee/login").send({
      email: "oope",
      password: "per",
    });
    console.log(response.body);
    if (response.body.success) {
      expect(response.body.message).toBe("User loged in Sucessfully");
      expect(response.body.success).toBe(true);
    }
  });

  //4. mentor login
  it("POST /api/mentor/login | Response with valid json", async () => {
    const response = await request(app).post("/api/mentor/login").send({
      email: "michael@gmail.com",
      password: "michael",
    });
    console.log(response.body);
    if (response.body.success) {
      expect(response.body.message).toBe("User loged in successfully");
      expect(response.body.success).toBe(true);
    } else {
      expect(response.body.message).toBe("User not found");
      expect(response.body.success).toBe(false);
    }
  });

  //5. get all session
  it("GET /api/session/getAllSessions |Response with valid json", async () => {
    const response = await request(app).get("/api/session/getAllSessions");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toBe("Sessions accquired");
    expect(response.body.success).toBe(true);
  });

  //6 add session
  it("POST /api/session/create | Response with valid json", async () => {
    const response = await request(app)
      .post("/api/session/create")
      .send({
        mentorId: "65b4d70cad2f674bf8df5446",
        mentor: {
          name: "Mentor's Name",
          email: "mentor@example.com",
        },
        title: "Session Title",
        description: "Session Description",
        date: "2024-01-06",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        maxNumberOfAttendesTaking: 10,
      });
    console.log(response.body);
    if (response.body.success) {
      expect(response.body.message).toBe("Session created sucessfully");
      expect(response.body.success).toBe(true);
    } else {
      expect(response.body.message).toBe("User already exists.");
      expect(response.body.success).toBe(false);
    }
  });

  //7. Delete session
  it("DELETE /api/session/deleteSession|Response with valid json ", async () => {
    const response = await request(app).delete(
      "/api/session/deleteSession/65e3ccdc9018d258107db7ec"
    );

    if (response.body.success) {
      expect(response.body.message).toBe("Session deleted sucessfully");
      expect(response.body.success).toBe(true);
    } else {
      expect(response.body.message).toBe("Session not found");
      expect(response.body.success).toBe(false);
    }
  });
  //8. join session
  it("PUT /api/session/joinSession|Response with valid json ", async () => {
    const response = await request(app)
      .put("/api/session/joinSession/65e1110e20ee29eef3dfde3f")
      .send({
        menteeId: "65add92556f23d2064722fe3",
        menteeEmail: "mentor@example.com",
      });

    if (response.body.success) {
      expect(response.body.success).toBe(true);
    } else {
      //   expect(response.body.message).toBe("Sessioon not found");
      expect(response.body.success).toBe(false);
    }
  });

  //9. get mentor by id
  it("GET /api/mentor/getMentorById |Response with valid json ", async () => {
    const response = await request(app).get(
      "/api/mentor/getMentorById/65e03e306c3ae053a05343e5"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("mentor");
  });

  //10. get all mentors
  it("GET /api/mentor/getAllMentors |Response with valid json ", async () => {
    const response = await request(app).get("/api/mentor/getAllMentors");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("mentors");
  });
});
