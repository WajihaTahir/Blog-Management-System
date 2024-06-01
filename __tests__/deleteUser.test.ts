import request from "supertest";
import { app } from "../src/app";
import UserModel from "../src/models/UserModel";
import { appErrors } from "../src/utils/appStrings";

jest.mock("../src/models/userModel");

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
});
