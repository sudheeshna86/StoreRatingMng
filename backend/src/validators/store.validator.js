import { body } from "express-validator";

export const createStoreValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Store name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid store email is required"),

  body("address")
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address cannot exceed 400 characters"),

  body("ownerId")
    .notEmpty()
    .withMessage("Store owner is required"),
];