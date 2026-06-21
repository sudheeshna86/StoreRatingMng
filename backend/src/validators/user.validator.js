import { body } from "express-validator";

export const createUserValidator = [
  body("name")
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 character"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email"),

  body("address")
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address cannot exceed 400 characters"),

  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage(
      "Password must contain at least one uppercase letter and one special character"
    ),

  body("role")
    .isIn([
      "ADMIN",
      "USER",
      "STORE_OWNER"
    ])
    .withMessage("Invalid role")
];