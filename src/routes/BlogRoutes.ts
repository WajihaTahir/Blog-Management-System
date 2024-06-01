import express from "express";

const blogRouter = express.Router();
import { validateCreateBlog } from "./validators/validators";
import jwtAuth from "../middlewares/jwtAuth";
import { createBlog } from "../controllers/BlogController";

blogRouter.post("/create", jwtAuth, validateCreateBlog, createBlog);

export default blogRouter;
