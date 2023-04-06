const requestSupertest = require("supertest");
const appServer = require("../../server");

describe("Post /user/login", () => {
  // afterAll(async () => {
  //   console.log("AfterAll");
  //   await appServer.close();
  // });

  it("Should return user email, subscription and token", async () => {
    const testUser = {
      email: "example3@example.com",
      password: "Exam_155ps$p",
    };
    const res = await requestSupertest(appServer)
      .post("/api/users/login")
      .send(testUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          email: expect.any(String),
          subscription: expect.any(String),
        }),
      })
    );
  });

  it("Should return unauthorized error", async () => {
    const testUser = {
      email: "WrongUser@example.com",
      password: "Exam_155ps$",
    };
    const res = await requestSupertest(appServer)
      .post("/api/users/login")
      .send(testUser);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });

  it("Should return validation error", async () => {
    const testUser = {
      email: "example.com",
      password: "unvalodPass",
    };
    const res = await requestSupertest(appServer)
      .post("/api/users/login")
      .send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });
});
