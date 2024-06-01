import { Request, Response, NextFunction } from "express";
import { UserType } from "../utils/types";
import { appErrors } from "../utils/appStrings";

export function authorizeRoles(...roles: ("user" | "admin")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).send(appErrors.notLoggedIn);
    }
    if (!roles.includes((req.user as UserType).role)) {
      return res.status(403).send(appErrors.unauthorizedRoute);
    }
    next();
  };
}
