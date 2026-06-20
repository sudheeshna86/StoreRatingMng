import pool from "../config/db.js";

export const getStoresForUser = async (
  userId,
  filters
) => {
  const {
    name,
    address,
    sortBy = "name",
    order = "ASC",
  } = filters;

  let query = `
    SELECT
      s.id,
      s.name,
      s.address,

      ROUND(
        COALESCE(
          AVG(r.rating),
          0
        ),
        1
      ) AS overall_rating,

      MAX(
        CASE
          WHEN r.user_id = $1
          THEN r.rating
        END
      ) AS user_rating

    FROM stores s

    LEFT JOIN ratings r
      ON s.id = r.store_id

    WHERE 1 = 1
  `;

  const values = [userId];
  let count = 2;

  if (name) {
    query += `
      AND s.name ILIKE $${count++}
    `;
    values.push(`%${name}%`);
  }

  if (address) {
    query += `
      AND s.address ILIKE $${count++}
    `;
    values.push(`%${address}%`);
  }

  query += `
    GROUP BY s.id
  `;

  const allowedSortFields = [
    "name",
  ];

  if (
    allowedSortFields.includes(
      sortBy
    )
  ) {
    query += `
      ORDER BY ${sortBy}
      ${
        order === "DESC"
          ? "DESC"
          : "ASC"
      }
    `;
  }

  const result = await pool.query(
    query,
    values
  );

  return result.rows;
};

export const findStoreById = async (
  storeId
) => {
  const result = await pool.query(
    `
      SELECT *
      FROM stores
      WHERE id = $1
    `,
    [storeId]
  );

  return result.rows[0];
};

export const findRating = async (
  userId,
  storeId
) => {
  const result = await pool.query(
    `
      SELECT *
      FROM ratings
      WHERE user_id = $1
      AND store_id = $2
    `,
    [
      userId,
      storeId,
    ]
  );

  return result.rows[0];
};

export const createRating = async (
  userId,
  storeId,
  rating
) => {
  const result = await pool.query(
    `
      INSERT INTO ratings
      (
        user_id,
        store_id,
        rating
      )
      VALUES ($1,$2,$3)
      RETURNING *
    `,
    [
      userId,
      storeId,
      rating,
    ]
  );

  return result.rows[0];
};

export const updateRating = async (
  userId,
  storeId,
  rating
) => {
  const result = await pool.query(
    `
      UPDATE ratings
      SET
        rating = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      AND store_id = $3
      RETURNING *
    `,
    [
      rating,
      userId,
      storeId,
    ]
  );

  return result.rows[0];
};