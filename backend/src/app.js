import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import adminRoutes from "./routes/admin.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

export default app;