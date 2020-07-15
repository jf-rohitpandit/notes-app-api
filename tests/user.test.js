const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const {
  userOne,
  userOneId,
  userTwoId,
  userTwo,
  taskOne,
  taskThree,
  taskTwo,
  setupDatabase,
} = require("./fixtures/db");


beforeEach(setupDatabase);

test("should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Rohit",
      email: "rohitpandit000001@gmail.com",
      password: "rohitrohit",
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: "Rohit",
    },
  });

  expect(user).not.toBe("rohitrohit");
});

test("should login in a user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("should not login in a user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: 'rafm@ram.com',
      password: userTwo.password,
    })
    .expect(400);
});

test("should return the profile of the user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not get the profile of unauthorized user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("should delete account for authorized users", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("should not delete unauthorized user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("should upload avtar", async () => {
  await request(app)
    .post("/users/me/avtar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avtar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avtar).toEqual(expect.any(Buffer));
});

test("should update user fields", async () => {
  await request(app)
    .patch("/users/me/")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "rohit",
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual("rohit");
});

test("should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      height: 160,
    })
    .expect(400);
});

