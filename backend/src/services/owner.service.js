import pool from "../config/db.js";

export const getOwnerStoreDashboard = async (
  ownerId
) => {
  const result = await pool.query(
    `
    SELECT
      s.id,

      s.name,
      s.email,
      s.address,

      u.name AS owner_name,
      u.email AS owner_email,

      COUNT(r.id) AS total_ratings,

      ROUND(
        COALESCE(
          AVG(r.rating),
          0
        ),
        1
      ) AS average_rating

    FROM stores s

    JOIN users u
      ON s.owner_id = u.id

    LEFT JOIN ratings r
      ON s.id = r.store_id

    WHERE s.owner_id = $1

    GROUP BY
      s.id,
      u.name,
      u.email
    `,
    [ownerId]
  );

  return result.rows[0];
};
export const getUsersWhoRatedStore =
  async (ownerId) => {
    const result =
      await pool.query(
        `
        SELECT
          u.id,
          u.name,
          u.email,
          r.rating,
          r.created_at

        FROM ratings r

        JOIN users u
          ON r.user_id = u.id

        JOIN stores s
          ON r.store_id = s.id

        WHERE s.owner_id = $1

        ORDER BY r.created_at DESC
        `,
        [ownerId]
      );

    return result.rows;
  };