// src/__tests__/controllers/user.controller.test.ts
import request from "supertest";
import { configureExpress } from "../../infrastructure/config/express.config";
import { User } from "../../infrastructure/schemas/user/user.schema";
import bcrypt from "bcrypt";

const app = configureExpress();

describe("UserController Integration Tests", () => {
  describe("POST /api/user - Register", () => {
    it("should successfully register a new user", async () => {
      const userData = {
        username: "user",
        email: "user@example.com",
        password: "Password123!",
      };

      const response = await request(app).post("/api/user").send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: "Usuario registrado exitosamente",
      });
    });

    it("should fail when registering with existing username", async () => {
      await User.create({
        username: "user",
        email: "user@example.com",
        password: await bcrypt.hash("Password123!", 10),
      });

      const response = await request(app).post("/api/user").send({
        username: "user",
        email: "another@example.com",
        password: "Password123!",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: "El usuario ya existe",
      });
    });
  });

  describe("POST /api/user/login - Login", () => {
    beforeEach(async () => {
      await User.create({
        username: "user",
        email: "user@example.com",
        password: await bcrypt.hash("Password123!", 10),
      });
    });

    it("should successfully login with correct credentials", async () => {
      const response = await request(app).post("/api/user/login").send({
        username: "user",
        password: "Password123!",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Login exitoso");
      expect(response.body.token).toBeDefined();
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should fail login with incorrect password", async () => {
      const response = await request(app).post("/api/user/login").send({
        username: "user",
        password: "WrongPassword123!",
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        message: "Credenciales inválidas",
      });
    });
  });

  describe("Protected routes", () => {
    let adminToken: string;
    let userToken: string;

    beforeEach(async () => {
      await User.create({
        username: "admin",
        email: "admin@example.com",
        password: await bcrypt.hash("AdminPass123!", 10),
        isAdmin: true,
      });

      await User.create({
        username: "normaluser",
        email: "user@example.com",
        password: await bcrypt.hash("UserPass123!", 10),
        isAdmin: false,
      });

      const adminLogin = await request(app).post("/api/user/login").send({
        username: "admin",
        password: "AdminPass123!",
      });
      adminToken = adminLogin.body.token;

      const userLogin = await request(app).post("/api/user/login").send({
        username: "normaluser",
        password: "UserPass123!",
      });
      userToken = userLogin.body.token;
    });

    describe("GET /api/user - Get all users", () => {
      it("should allow admin to get all users", async () => {
        const response = await request(app)
          .get("/api/user")
          .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });

      it("should not allow normal user to get all users", async () => {
        const response = await request(app)
          .get("/api/user")
          .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });
    });

    describe("GET /api/user/:id - Get user by ID", () => {
      it("should allow admin to get user by id", async () => {
        const users = await User.find();
        const userId = users[0]._id
          ? users[0]._id.toString()
          : users[0].toString();

        const response = await request(app)
          .get(`/api/user/${userId}`)
          .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("username");
        expect(response.body).toHaveProperty("email");
      });
    });

    describe("DELETE /api/user/:id - Delete user", () => {
      it("should allow admin to delete user", async () => {
        const userToDelete = await User.create({
          username: "delete",
          email: "delete@example.com",
          password: await bcrypt.hash("Delete123!", 10),
        });

        const response = await request(app)
          .delete(`/api/user/${userToDelete._id}`)
          .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(204);

        const deletedUser = await User.findById(userToDelete._id);
        expect(deletedUser).toBeNull();
      });
    });
  });
});
