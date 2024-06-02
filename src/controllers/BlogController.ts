import BlogModel from "../models/BlogModel";
import { Request, Response } from "express";
import { appErrors } from "../utils/appStrings";
import { UserType } from "../utils/types";

export const createBlog = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  try {
    const blog = await BlogModel.create({
      title: title,
      content: content,
      ownedbyuser: (req?.user as UserType)?._id,
    });
    if (!blog) {
      res.status(500).json({ error: appErrors.blogSubmissionError });
    }

    return res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getBlog = async (req: Request, res: Response) => {
  try {
    const foundBlog = await BlogModel.findOne({
      _id: req.params.id,
    });
    if (!foundBlog) {
      return res.status(404).json({ error: appErrors.noBlogFound });
    }
    res.status(200).json(foundBlog);
  } catch (e) {
    res.status(500).json({ error: appErrors.generalError });
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const allBlogs = await BlogModel.find({});

    res.status(201).json({
      blogs: allBlogs,
    });
  } catch (error) {
    res.status(500).json({
      error,
      messsage: appErrors.generalError,
    });
  }
};
