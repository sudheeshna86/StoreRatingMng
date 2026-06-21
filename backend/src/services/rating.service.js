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
    page = 1,
    limit = 10,
  } = filters;

  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const pageLimit = Math.max(1, parseInt(limit, 10) || 10);
  const offset = (currentPage - 1) * pageLimit;

  let baseQuery = `
    FROM stores s

    LEFT JOIN ratings r
      ON s.id = r.store_id

    WHERE 1 = 1
  `;

  const filterValues = [];
  let count = 1;

  if (name) {
    baseQuery += `
      AND s.name ILIKE $${count++}
    `;
    filterValues.push(`%${name}%`);
  }

  if (address) {
    baseQuery += `
      AND s.address ILIKE $${count++}
    `;
    filterValues.push(`%${address}%`);
  }

  const countQuery = `
    SELECT COUNT(*)
    FROM (
      SELECT s.id
      ${baseQuery}
      GROUP BY s.id
    ) AS sub
  `;

  const countResult = await pool.query(
    countQuery,
    filterValues
  );

  const queryCountStart = count + 1;

  const totalRecords = Number(
    countResult.rows[0].count
  );
  const totalPages = Math.max(
    1,
    Math.ceil(totalRecords / pageLimit)
  );

  const safePage = Math.min(currentPage, totalPages);
  const currentPageClamped = Math.max(1, safePage);
  const offsetClamped = (currentPageClamped - 1) * pageLimit;

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
    ${baseQuery}
    GROUP BY s.id
  `;

  const allowedSortFields = [
    "name",
    "address",
    "overall_rating",
  ];

  if (allowedSortFields.includes(sortBy)) {
    if (sortBy === "overall_rating") {
      query += `
      ORDER BY ROUND(COALESCE(AVG(r.rating), 0), 1)
      ${
        order === "DESC"
          ? "DESC"
          : "ASC"
      }
    `;
    } else {
      query += `
      ORDER BY ${sortBy}
      ${
        order === "DESC"
          ? "DESC"
          : "ASC"
      }
    `;
    }
  }

  query += ` LIMIT $${queryCountStart} OFFSET $${queryCountStart + 1}`;

  const result = await pool.query(query, [
    userId,
    ...filterValues,
    pageLimit,
    offsetClamped,
  ]);

  return {
    rows: result.rows,
    pagination: {
      currentPage: currentPageClamped,
      limit: pageLimit,
      totalRecords,
      totalPages,
    },
  };
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