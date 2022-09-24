const app = require("./app");
const request = require("supertest");
const fs = require("fs");

// jest.useFakeTimers();
describe("POST /api/merchandise", () => {
  let imageId = [];
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
    });
  });
});
