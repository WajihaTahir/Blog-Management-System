import express from "express";
import { validateCreateBlog } from "./validators/validators";
import jwtAuth from "../middlewares/jwtAuth";
import { createBlog, getBlog } from "../controllers/BlogController";

const blogRouter = express.Router();

blogRouter.post("/create", jwtAuth, validateCreateBlog, createBlog);
blogRouter.get("/:id", jwtAuth, getBlog);

export default blogRouter;
