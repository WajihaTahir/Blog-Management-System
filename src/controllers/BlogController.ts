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
