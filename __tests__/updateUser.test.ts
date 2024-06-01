import request from "supertest";
import { app } from "../src/app";
import UserModel from "../src/models/UserModel";
import { appErrors, appMessages } from "../src/utils/appStrings";
import jwtAuth from "../src/middlewares/jwtAuth";
import { NextFunction, Request, Response } from "express";

jest.mock("../src/models/userModel");
jest.mock("../src/middlewares/jwtAuth", () => jest.fn());

describe("PATCH /api/user/:id", () => {
  const updateUserRoute = "/api/user/123";

  const mockUser = {
    _id: 123,
    email: "test@example.com",
    username: "testuser",
    role: "user",
  };

  it("should return validation error for invalid email", async () => {
    jwtAuth.mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.user = { id: "123", role: "user" };
        next();
      }
    );
    const response = await request(app).patch(updateUserRoute).send({
      email: "invalid-email",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: appErrors.invalidEmailError }),
      ])
    );
  });

  it("should return validation error for short password", async () => {
    jwtAuth.mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.user = { id: "123", role: "user" };
        next();
      }
    );
    const response = await request(app).patch(updateUserRoute).send({
      password: "short",
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

  it("should throw error if user not authorized", async () => {
    jwtAuth.mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.user = { _id: "1234", role: "user" };
        next();
      }
    );

    const response = await request(app).patch(updateUserRoute).send({
      email: "abc@email.com",
    });

    expect(response.status).toBe(401);
  });

  it("should let user update their own profile", async () => {
    jwtAuth.mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.user = { _id: "123", role: "user" };
        next();
      }
    );

    (UserModel.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUser),
    }));

    const response = await request(app).patch(updateUserRoute).send({
      email: "abc@email.com",
    });

    expect(response.status).toBe(200);
  });

  it("should let user other users update if role is admin", async () => {
    jwtAuth.mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.user = { _id: "1234", role: "admin" };
        next();
      }
    );

    (UserModel.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUser),
    }));

    const response = await request(app).patch(updateUserRoute).send({
      email: "abc@email.com",
    });

    expect(response.status).toBe(200);
  });
});
