import express from "express";
import { createUser, login } from "../controllers/UserController";
const userRouter = express.Router();
import {
  validateCreateUserInput,
  validateLoginInput,
} from "./validators/validators";

userRouter.post("/create", validateCreateUserInput, createUser);
userRouter.post("/login", validateLoginInput, login);

export default userRouter;
