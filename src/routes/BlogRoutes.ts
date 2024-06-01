import express from "express";
import { validateCreateBlog } from "../middlewares/validators";
import jwtAuth from "../middlewares/jwtAuth";
import { createBlog, getBlog } from "../controllers/BlogController";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const blogRouter = express.Router();

blogRouter.post(
  "/create",
  jwtAuth,
  authorizeRoles("user"),
  validateCreateBlog,
  createBlog
);

blogRouter.get("/:id", jwtAuth, authorizeRoles("user"), getBlog);

export default blogRouter;
