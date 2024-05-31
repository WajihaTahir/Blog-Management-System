import { body, validationResult } from "express-validator";
import { appErrors } from "../../utils/appStrings";
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
