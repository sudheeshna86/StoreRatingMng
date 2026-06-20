import { body } from "express-validator";
import bcrypt from "bcryptjs";
export const registerValidator = [
  body("name")
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email"),

  body("address")
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address must not exceed 400 characters"),

  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8-16 characters")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage(
      "Password must contain at least one uppercase letter and one special character"
    ),
];

export const loginValidator = [
  body("email").isEmail(),
  body("password").notEmpty(),
];


export const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage(
      "Current password is required"
    ),

  body("newPassword")
    .isLength({
      min: 8,
      max: 16,
    })
    .withMessage(
      "Password must be between 8 and 16 characters"
    )
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])/
    )
    .withMessage(
      "Password must contain uppercase and special character"
    ),

  body("confirmPassword")
    .notEmpty()
    .withMessage(
      "Confirm password is required"
    ),
];