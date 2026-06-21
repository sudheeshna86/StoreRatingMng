import bcrypt from "bcryptjs";

import {
  createUser,
  findUserByEmail,
   updatePassword,
   findUserById,
} from "../services/auth.service.js";

import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
    } = req.body;

   
    const existingUser =
      await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await createUser({
        name,
        email,
        password: hashedPassword,
        address,
      });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const changePassword =
  async (req, res) => {
    try {

      const userId =
        req.user.id;

      const {
        currentPassword,
        newPassword,
        confirmPassword,
      } = req.body;

      if (
        newPassword !==
        confirmPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Passwords do not match",
        });
      }

      const user =
        await findUserById(
          userId
        );

      const isMatch =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message:
            "Current password is incorrect",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      await updatePassword(
        userId,
        hashedPassword
      );

      return res.status(200).json({
        success: true,
        message:
          "Password updated successfully",
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });

    }
  };