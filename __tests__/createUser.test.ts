import request from "supertest";
import { app } from "../src/app";
import { encryptPassword } from "../src/utils/encryptPassword";
import UserModel from "../src/models/UserModel";
import { appErrors, appMessages } from "../src/utils/appStrings";
import jwtAuth from "../src/middlewares/jwtAuth";
import { NextFunction, Request, Response } from "express";

jest.mock("../src/utils/encryptPassword");
jest.mock("../src/models/userModel");
jest.mock("../src/middlewares/jwtAuth", () => jest.fn());

beforeAll(() => {
  jwtAuth.mockImplementation(
    (req: Request, res: Response, next: NextFunction) => {
      req.user = { id: "123", role: "admin" };
      next();
    }
  );
});

const mockUser = {
  email: "test@example.com",
  username: "testuser",
  role: "user",
};

describe("POST /api/user/create", () => {
  const createRoute = "/api/user/create";

  it("should return validation error for missing username", async () => {
    const response = await request(app).post(createRoute).send({
      email: "test@example.com",
      password: "password123",
      role: "user",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: appErrors.userNameMissingError }),
      ])
    );
  });

  it("should return validation error for invalid email", async () => {
    const response = await request(app).post(createRoute).send({
      username: "testuser",
      email: "invalid-email",
      password: "password123",
      role: "user",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: appErrors.invalidEmailError }),
      ])
    );
  });

  it("should return validation error for short password", async () => {
    const response = await request(app).post(createRoute).send({
      username: "testuser",
      email: "test@example.com",
      password: "short",
      role: "user",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: appErrors.invalidPasswordError,
        }),
      ])
    );
  });

  it("should return validation error for invalid role", async () => {
    const response = await request(app).post(createRoute).send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      role: "invalidrole",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: appErrors.invalidRoleError,
        }),
      ])
    );
  });

  it("should create a user successfully with valid input", async () => {
    (encryptPassword as jest.Mock).mockResolvedValue("hashedpassword123");

    (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).post(createRoute).send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      role: "user",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: appMessages.userCreateSuccess,
      data: {
        user: mockUser,
      },
    });
  });

  it("should not allow user role to creat new user", async () => {
    jwtAuth.mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.user = { id: "123", role: "user" };
        next();
      }
    );

    (encryptPassword as jest.Mock).mockResolvedValue("hashedpassword123");

    (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).post(createRoute).send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      role: "user",
    });

    expect(response.status).toBe(403);
  });
});
