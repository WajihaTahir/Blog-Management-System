import request from "supertest";
import { app } from "../src/app";
import BlogModel from "../src/models/BlogModel";
import { appErrors } from "../src/utils/appStrings";
import jwtAuth from "../src/middlewares/jwtAuth";
import { NextFunction, Response, Request } from "express";

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

describe("GET /api/blog/:id", () => {
  const getBlogRoute = "/api/blog/123";

  const mockBlog = {
    title: "test title",
    content: "test content",
    ownedbyuser: "123",
  };

  it("should return blog if blog found", async () => {
    (BlogModel.findOne as jest.Mock).mockResolvedValue(mockBlog);

    const response = await request(app).get(getBlogRoute).send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockBlog);
  });

  it("should throw error if blog not found", async () => {
    (BlogModel.findOne as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).get(getBlogRoute).send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: appErrors.noBlogFound });
  });
});
