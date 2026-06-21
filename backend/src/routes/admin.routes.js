import express from "express";

import {
  getDashboard,
  createUser,
  getAllUsers,
  getUserDetails,
  getStoreOwnersWithoutStoreHandler,
} from "../controllers/admin.controller.js";    

import {
  createUserValidator
} from "../validators/user.validator.js";

import validate from "../middlewares/validation.middleware.js";

import authMiddleware from "../middlewares/auth.middleware.js";

import authorize from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  authorize("ADMIN"),
  getDashboard
);

router.post(
  "/users",
  authMiddleware,
  authorize("ADMIN"),
  createUserValidator,
  validate,
  createUser
);

router.get(
  "/users",
  authMiddleware,
  authorize("ADMIN"),
  getAllUsers
);

router.get(
  "/users/:id",
  authMiddleware,
  authorize("ADMIN"),
  getUserDetails
);

router.get(
  "/owners-without-store",
  authMiddleware,
  authorize("ADMIN"),
  getStoreOwnersWithoutStoreHandler
);
export default router;