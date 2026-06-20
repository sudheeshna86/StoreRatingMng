import express from "express";

import {
  getDashboard,
} from "../controllers/admin.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

import authorize from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  authorize("ADMIN"),
  getDashboard
);

export default router;