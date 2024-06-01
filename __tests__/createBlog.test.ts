import request from "supertest";
import { app } from "../src/app";
import jwtAuth from "../src/middlewares/jwtAuth";

import BlogModel from "../src/models/BlogModel";
import { appErrors } from "../src/utils/appStrings";
import { NextFunction, Request, Response } from "express";

jest.mock("../src/models/blogModel");
jest.mock("../src/middlewares/jwtAuth", () => jest.fn());

beforeAll(() => {
  jwtAuth.mockImplementation(
    (req: Request, res: Response, next: NextFunction) => {
      req.user = { id: "123", role: "user" };
      next();
    }
  );
});

describe("POST /api/blog/create", () => {
  const createRoute = "/api/blog/create";

  it("should return validation error for missing title", async () => {
    const response = await request(app).post(createRoute).send({
      content: "test content",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: appErrors.blogTitleMissing }),
      ])
    );
  });

  it("should return validation error for missing content", async () => {
    const response = await request(app).post(createRoute).send({
      title: "test title",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: appErrors.blogContentMissing }),
      ])
    );
  });

  it("should create a user successfully with valid input", async () => {
    const mockBlog = {
      title: "test title",
      content: "test content",
      ownedbyuser: "123",
    };
    (BlogModel.create as jest.Mock).mockResolvedValue(mockBlog);

    const response = await request(app).post(createRoute).send(mockBlog);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      blog: mockBlog,
    });
  });
});
