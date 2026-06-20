import pool from "../config/db.js";

export const getDashboardStats = async () => {
  const usersResult = await pool.query(
    "SELECT COUNT(*) FROM users"
  );

  const storesResult = await pool.query(
    "SELECT COUNT(*) FROM stores"
  );

  const ratingsResult = await pool.query(
    "SELECT COUNT(*) FROM ratings"
  );

  return {
    totalUsers: Number(
      usersResult.rows[0].count
    ),

    totalStores: Number(
      storesResult.rows[0].count
    ),

    totalRatings: Number(
      ratingsResult.rows[0].count
    ),
  };
};