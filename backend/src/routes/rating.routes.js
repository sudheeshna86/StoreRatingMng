import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";

import authorize from "../middlewares/role.middleware.js";

import validate from "../middlewares/validation.middleware.js";

import {
  ratingValidator,
} from "../validators/rating.validator.js";

import {
  getStores,
  submitRating,
  modifyRating,
} from "../controllers/rating.controller.js";

const router =
  express.Router();

router.get(
  "/stores",
  authMiddleware,
  authorize("USER"),
  getStores
);

router.post(
  "/stores/:storeId/rating",
  authMiddleware,
  authorize("USER"),
  ratingValidator,
  validate,
  submitRating
);

router.put(
  "/stores/:storeId/rating",
  authMiddleware,
  authorize("USER"),
  ratingValidator,
  validate,
  modifyRating
);

export default router;