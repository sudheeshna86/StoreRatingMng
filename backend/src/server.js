import "dotenv/config";

import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const client = await pool.connect();

    const result = await client.query("SELECT NOW()");

    console.log("Database Connected Successfully");
    console.log(result.rows[0]);

    client.release();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database Connection Failed");
    console.error(error);
  }
};

startServer();