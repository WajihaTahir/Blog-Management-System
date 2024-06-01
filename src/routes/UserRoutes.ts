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
import { authorizeRoles } from "../middlewares/authorizeRoles";

userRouter.post(
  "/create",
  jwtAuth,
  authorizeRoles("admin"),
  validateCreateUserInput,
  createUser
);

userRouter.post("/login", validateLoginInput, login);

userRouter.get("/:id", jwtAuth, authorizeRoles("admin", "user"), getUser);

userRouter.patch(
  "/:id",
  jwtAuth,
  authorizeRoles("admin", "user"),
  validateUpdateUserInput,
  updateUser
);

userRouter.delete("/:id", jwtAuth, authorizeRoles("admin"), deleteUser);

export default userRouter;
