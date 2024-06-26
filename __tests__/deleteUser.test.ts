import request from "supertest";
import { app } from "../src/app";
import UserModel from "../src/models/UserModel";
import { appErrors } from "../src/utils/appStrings";
import jwtAuth from "../src/middlewares/jwtAuth";
import { NextFunction, Request, Response } from "express";

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

describe("DELETE /api/user/:id", () => {
  const getUserRoute = "/api/user/123";

  const mockUser = {
    _id: 123,
    email: "test@example.com",
    username: "testuser",
    role: "user",
  };

  it("should delete user if user found", async () => {
    (UserModel.findOneAndDelete as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).delete(getUserRoute).send();

    expect(response.status).toBe(200);
  });

  it("should throw error if user not found", async () => {
    (UserModel.findOneAndDelete as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).delete(getUserRoute).send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: appErrors.userIdNotFound });
  });

  it("should not allow user role to delete a user", async () => {
    jwtAuth.mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.user = { id: "123", role: "user" };
        next();
      }
    );
    (UserModel.findOneAndDelete as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).delete(getUserRoute).send();

    expect(response.status).toBe(403);
  });
});
