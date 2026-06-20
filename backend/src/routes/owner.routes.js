import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";

import authorize from "../middlewares/role.middleware.js";

import {
  getDashboard,
  getRatings,
} from "../controllers/owner.controller.js";

const router =
  express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  authorize("STORE_OWNER"),
  getDashboard
);

router.get(
  "/ratings",
  authMiddleware,
  authorize("STORE_OWNER"),
  getRatings
);

export default router;