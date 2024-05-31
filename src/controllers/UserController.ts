import UserModel from "../models/UserModel";
import { encryptPassword } from "../utils/encryptPassword";
import { appErrors, appMessages } from "../utils/appStrings";
import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  const { email, password, username, role } = req.body;
  try {
    const hashedPassword = await encryptPassword(password); // Encrypt password

    if (!hashedPassword) {
      return res.status(500).json({ error: appErrors.passwordEncryptionError });
    }

    const newUser = await UserModel.create({
      email: email,
      password: hashedPassword,
      username: username,
      role: role,
    });

    res.status(200).json({
      message: appMessages.userCreateSuccess,
      data: {
        user: {
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      },
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: appErrors.generalError });
  }
};
