import express from "express";
import { createUser } from "../controllers/UserController";
const userRouter = express.Router();
import { validateCreateUserInput } from "./validators/validators";

userRouter.post("/create", validateCreateUserInput, createUser);

export default userRouter;
