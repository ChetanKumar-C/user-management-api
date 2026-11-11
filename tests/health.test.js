const request = require("supertest");
const app = require("../src/app");

describe("API Health Check", () => {

    test("should return 200 when API is healthy", async () => {
        const response = await request(app).get("/api/health");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("API is healthy");
    });

});