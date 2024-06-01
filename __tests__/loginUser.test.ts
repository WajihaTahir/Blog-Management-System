import request from "supertest";
import { app } from "../src/app";
import UserModel from "../src/models/UserModel";
import { appErrors, appMessages } from "../src/utils/appStrings";
import { verifyPassword } from "../src/utils/verifyPassword";
import { generateToken } from "../src/utils/tokenServices";

jest.mock("../src/models/userModel");
jest.mock("../src/utils/verifyPassword");
jest.mock("../src/utils/tokenServices");

describe("POST /api/user/login", () => {
  const loginRoute = "/api/user/login";

  it("should return validation error for invalid email", async () => {
    const response = await request(app).post(loginRoute).send({
      email: "invalid-email",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: appErrors.invalidEmailError }),
      ])
    );
  });

  it("should return validation error if no password", async () => {
    const response = await request(app).post(loginRoute).send({
      email: "test@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: appErrors.passwordRequiredError,
        }),
      ])
    );
  });

  it("should login successfully with valid input", async () => {
    (verifyPassword as jest.Mock).mockResolvedValue(true);
    (generateToken as jest.Mock).mockResolvedValue({});

    (UserModel.findOne as jest.Mock).mockResolvedValue({
      email: "test@example.com",
      username: "testuser",
      role: "user",
    });

    const response = await request(app).post(loginRoute).send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: appMessages.loginSuccess,
      data: {
        user: {
          username: "testuser",
          email: "test@example.com",
          role: "user",
        },
        token: {},
      },
    });
  });
});
