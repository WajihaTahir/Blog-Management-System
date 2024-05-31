import UserModel from "../models/UserModel";
import { encryptPassword } from "../utils/encryptPassword";
import { appErrors, appMessages } from "../utils/appStrings";
import { Request, Response } from "express";
import { verifyPassword } from "../utils/verifyPassword";
import { generateToken } from "../utils/tokenServices";

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

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const foundUser = await UserModel.findOne({ email: email });

    if (!foundUser)
      return res.status(404).json({ error: appErrors.userNotFound });
    if (foundUser) {
      const isPasswordCorrect = await verifyPassword(
        password,
        foundUser.password
      );

      if (!isPasswordCorrect) {
        return res.status(500).json({
          error: appErrors.incorrectPassword,
        });
      }
      if (isPasswordCorrect) {
        const token = generateToken(foundUser._id?.toString());
        if (!token) {
          return res.status(500).json({
            message: appErrors.tokenError,
            error: true,
            data: null,
          });
        }
        if (token) {
          const user = {
            _id: foundUser._id,
            email: foundUser.email,
            username: foundUser.username,
            createdAt: foundUser.createdAt,
            role: foundUser.role,
          };
          return res.status(200).json({
            message: appMessages.loginSuccess,
            data: {
              user: user,
              token,
            },
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: appErrors.generalError });
  }
};
