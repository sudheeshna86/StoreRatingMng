import { body } from "express-validator";

export const ratingValidator = [
  body("rating")
    .isFloat({
      min: 1,
      max: 5,
    })
    .withMessage("Rating must be between 1 and 5"),
];