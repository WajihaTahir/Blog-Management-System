import request from "supertest";
import { app } from "../src/app";
import { encryptPassword } from "../src/utils/encryptPassword";
import UserModel from "../src/models/UserModel";
import { appErrors, appMessages } from "../src/utils/appStrings";

jest.mock("../src/utils/encryptPassword");
jest.mock("../src/models/userModel");

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

    (UserModel.create as jest.Mock).mockResolvedValue({
      email: "test@example.com",
      username: "testuser",
      role: "user",
    });

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
        user: {
          username: "testuser",
          email: "test@example.com",
          role: "user",
        },
      },
    });
  });
});
