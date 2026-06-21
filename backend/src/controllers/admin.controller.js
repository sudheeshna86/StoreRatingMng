import bcrypt from "bcryptjs";

import {
  getDashboardStats,
  findUserByEmail,
  createUserByAdmin,
  getUsers,
  getUserById,
  getStoreOwnersWithoutStore,
} from "../services/admin.service.js";

export const getDashboard = async (req,res) => {
  try {
    const stats =
      await getDashboardStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

export const createUser = async (
  req,
  res
) => {
  try {

    const {
      name,
      email,
      password,
      address,
      role
    } = req.body;

    const existingUser =
      await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Email already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await createUserByAdmin({
        name,
        email,
        password:
          hashedPassword,
        address,
        role
      });

    return res.status(201).json({
      success: true,
      message:
        "User created successfully",
      data: user
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

export const getAllUsers = async (
  req,
  res
) => {
  try {
    const {
      rows,
      pagination,
    } = await getUsers(req.query);

    return res.status(200).json({
      success: true,
      count: pagination.totalRecords,
      pagination,
      data: rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getStoreOwnersWithoutStoreHandler = async (
  req,
  res
) => {
  try {
    const owners = await getStoreOwnersWithoutStore();

    return res.status(200).json({
      success: true,
      data: owners,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getUserDetails = async (
  req,
  res
) => {
  try {
    const user =
      await getUserById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
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