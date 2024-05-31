import express from "express";
import { createUser, getUser, login } from "../controllers/UserController";
const userRouter = express.Router();
import {
  validateCreateUserInput,
  validateLoginInput,
} from "./validators/validators";

userRouter.post("/create", validateCreateUserInput, createUser);
userRouter.post("/login", validateLoginInput, login);
userRouter.get("/:id", getUser);

export default userRouter;
