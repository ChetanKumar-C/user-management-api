const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

describe("User Registration API", () => {

    beforeEach(async () => {
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    test("should create a user successfully", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "password123"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.email).toBe("test@example.com");
        expect(response.body.data).not.toHaveProperty("passwordHash");
    });

    test("should reject registration with missing fields", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test("should reject an invalid email", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                email: "invalid-email",
                password: "password123"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject a password shorter than 8 characters", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                email: "short@example.com",
                password: "123"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject duplicate email registration", async () => {
        const user = {
            name: "Test User",
            email: "duplicate@example.com",
            password: "password123"
        };

        await request(app).post("/api/users").send(user);

        const response = await request(app)
            .post("/api/users")
            .send(user);

        expect(response.statusCode).toBe(409);
        expect(response.body.success).toBe(false);
    });

});


test("should retrieve all users", async () => {
    await request(app)
        .post("/api/users")
        .send({
            name: "User One",
            email: "userone@example.com",
            password: "password123"
        });

    await request(app)
        .post("/api/users")
        .send({
            name: "User Two",
            email: "usertwo@example.com",
            password: "password123"
        });

    const response = await request(app).get("/api/users");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(2);
    expect(response.body.data).toHaveLength(2);
});