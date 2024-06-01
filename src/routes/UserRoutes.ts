import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  login,
  updateUser,
} from "../controllers/UserController";
const userRouter = express.Router();
import {
  validateCreateUserInput,
  validateLoginInput,
  validateUpdateUserInput,
} from "./validators/validators";
import jwtAuth from "../middlewares/jwtAuth";

userRouter.post("/create", validateCreateUserInput, createUser);
userRouter.post("/login", validateLoginInput, login);
userRouter.get("/:id", getUser);
userRouter.patch("/:id", jwtAuth, validateUpdateUserInput, updateUser);
userRouter.delete("/:id", jwtAuth, deleteUser);

export default userRouter;
