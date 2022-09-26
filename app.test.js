const app = require("./app");
const request = require("supertest");
const fs = require("fs");
const {
  expect,
  afterAll,
  beforeAll,
  describe,
  test,
} = require("@jest/globals");
const db = require("./models");

beforeAll(async () => {
  await db.sequelize.sync({ alter: true });
}, 30000);

describe("POST /api/merchandise", () => {
  let imageId = [];
  let createdMerchandiseId;
  describe("Post /api/uploads", () => {
    expect.extend({
      allObjectInUploadArrayHasIdAndUrl: (received) => {
        try {
          const fields = ["id", "url"];
          received.forEach((obj) => {
            const keys = Object.keys(obj);
            for (x of fields) {
              if (!keys.includes(x)) throw `missing field "${x}"`;
            }
          });
          return {
            message: () => `id and url found in all objects`,
            pass: true,
          };
        } catch (err) {
          return {
            message: () => err,
            pass: false,
          };
        }
      },
    });
    test("should respond with a status code of 200 and should be an array containing objects", async () => {
      const response = await request(app)
        .post("/api/uploads")
        .attach(
          "images",
          fs.readFileSync(__dirname + "/public/img/test.jpeg"),
          "testFile.jpg"
        );
      expect(response.body);
      expect(response.body).allObjectInUploadArrayHasIdAndUrl();
      imageId = response.body.map((img) => img.id);
    });
  });

  describe("create merchandise", () => {
    test("should respond with status code 200 'ok'", async () => {
      const response = await request(app)
        .post("/api/merchandise")
        .send({
          name: "product name",
          quantity: 100,
          sizes: ["XL", "M"],
          price: 1000,
          merchandiseImages: imageId,
        });
      expect(response.statusCode).toBe(200);
      createdMerchandiseId = response.body.id;
    });
  });

  describe("edit merchandise items", () => {
    test("should return 200 with the fields value changed", async () => {
      const newObject = {
        name: "changed",
        quantity: 10,
        price: "100.00",
        sizes: ["XL"],
      };
      const response = await request(app)
        .patch(`/api/merchandise/${createdMerchandiseId}`)
        .send(newObject);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        ...newObject,
        id: expect.any(String),
      });
    });
  });

  describe("delete merchandise", () => {
    test("should return an id and status of 200 'ok'", async () => {
      const response = await request(app).delete(
        `/api/merchandise/${createdMerchandiseId}`
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: expect.any(String),
      });
    });
  });
});

afterAll(async () => {
  await db.sequelize.close();
});
