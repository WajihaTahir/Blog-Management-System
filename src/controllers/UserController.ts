import UserModel from "../models/UserModel";
import { encryptPassword } from "../utils/encryptPassword";
import { appErrors, appMessages } from "../utils/appStrings";
import { Request, Response } from "express";
import { verifyPassword } from "../utils/verifyPassword";
import { generateToken } from "../utils/tokenServices";
import { UserType, UpdateUserFieldType } from "../utils/types";

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

export const getUser = async (req: Request, res: Response) => {
  try {
    const foundUser = await UserModel.findOne({
      _id: req.params.id,
    }).select("-password");
    if (!foundUser) {
      return res.status(404).json({ error: appErrors.noUserFound });
    }
    res.status(200).json(foundUser);
  } catch (e) {
    res.status(500).json({ error: appErrors.generalError });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const id = req.params.id;
  try {
    if ((req?.user as UserType)?.role === "user") {
      if (id !== (req?.user as UserType)?._id?.toString()) {
        return res.status(401).json({ error: appErrors.unauthorizedError });
      }
    }
    const updatedUserFields: UpdateUserFieldType = {};
    if (username) {
      updatedUserFields.username = username;
    }
    if (email) {
      updatedUserFields.email = email;
    }
    if (password) {
      updatedUserFields.password = password;
    }

    const updatedUserData = await UserModel.findByIdAndUpdate(
      id,
      updatedUserFields,
      {
        new: true,
      }
    ).select("-password");
    return res
      .status(200)
      .json({ message: "update successful", user: updatedUserData });
  } catch (error) {
    res
      .status(400)
      .json({ message: "error updating the user info", error: error });
  }
};
