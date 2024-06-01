import { body, validationResult } from "express-validator";
import { appErrors } from "../utils/appStrings";
import { Request, Response, NextFunction } from "express";

export const validateCreateUserInput = [
  body("username").isString().withMessage(appErrors.userNameMissingError),
  body("email").isEmail().withMessage(appErrors.invalidEmailError),
  body("password")
    .isLength({ min: 8 })
    .withMessage(appErrors.invalidPasswordError),
  body("role").custom((value) => {
    if (!["user", "admin"].includes(value)) {
      throw new Error(appErrors.invalidRoleError);
    }
    return true;
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateLoginInput = [
  body("email").isEmail().withMessage(appErrors.invalidEmailError),
  body("password").isString().withMessage(appErrors.passwordRequiredError),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateUpdateUserInput = [
  body("username").optional().isString().withMessage(appErrors.userNameInvalid),
  body("email").optional().isEmail().withMessage(appErrors.invalidEmailError),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage(appErrors.invalidPasswordError),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateCreateBlog = [
  body("title").isString().withMessage(appErrors.blogTitleMissing),
  body("content").isString().withMessage(appErrors.blogContentMissing),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
