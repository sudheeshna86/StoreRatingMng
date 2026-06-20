import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import storeRoutes from "./routes/store.routes.js";
import ownerRoutes from "./routes/owner.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/admin", adminRoutes);
app.use(
  "/api/admin/stores",
  storeRoutes
);
app.use(
  "/api/owner",
  ownerRoutes
);

app.use(
  "/api",
  ratingRoutes
);
app.use(errorHandler);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

export default app;