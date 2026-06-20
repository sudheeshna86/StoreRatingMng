import express from "express";

import {
  register,
  login,
    changePassword,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";

import {
  registerValidator,
  loginValidator,
  changePasswordValidator
} from "../validators/auth.validator.js";

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  validate,
  register
);

router.post(
  "/login",
  loginValidator,
  validate,
  login
);

router.put(
  "/change-password",
  authMiddleware,
  changePasswordValidator,
  validate,
  changePassword
);
export default router;