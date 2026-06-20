import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createStoreValidator
} from "../validators/store.validator.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
  createStoreHandler,
  getAllStores,
  getStoreDetails
} from "../controllers/store.controller.js";
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  createStoreValidator,
  validate,
  createStoreHandler
);

router.get(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  getAllStores
);

router.get(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  getStoreDetails
);

export default router;