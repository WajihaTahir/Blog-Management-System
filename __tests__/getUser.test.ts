import request from "supertest";
import { app } from "../src/app";
import UserModel from "../src/models/UserModel";
import { appErrors } from "../src/utils/appStrings";
import { NextFunction, Request, Response } from "express";
import jwtAuth from "../src/middlewares/jwtAuth";

jest.mock("../src/models/userModel");
jest.mock("../src/middlewares/jwtAuth", () => jest.fn());

beforeAll(() => {
  jwtAuth.mockImplementation(
    (req: Request, res: Response, next: NextFunction) => {
      req.user = { _id: "123", role: "user" };
      next();
    }
  );
});

describe("GET /api/user/:id", () => {
  const getUserRoute = "/api/user/123";

  const mockUser = {
    _id: "123",
    email: "test@example.com",
    username: "testuser",
    role: "user",
  };

  it("should return user if user found", async () => {
    (UserModel.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUser),
    }));

    const response = await request(app).get(getUserRoute).send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  it("should throw error if user not found", async () => {
    (UserModel.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(undefined),
    }));

    const response = await request(app).get(getUserRoute).send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: appErrors.noUserFound });
  });

  it("should not let users read other users", async () => {
    jwtAuth.mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.user = { _id: "1234", role: "user" };
        next();
      }
    );
    (UserModel.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUser),
    }));

    const response = await request(app).get(getUserRoute).send();

    expect(response.status).toBe(401);
  });
});
