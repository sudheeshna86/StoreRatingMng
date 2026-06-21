import pool from "../config/db.js";

export const createStore = async ({
  name,
  email,
  address,
  ownerId,
}) => {
  const result = await pool.query(
    `
      INSERT INTO stores
      (
        name,
        email,
        address,
        owner_id
      )
      VALUES ($1,$2,$3,$4)
      RETURNING *
    `,
    [
      name,
      email,
      address,
      ownerId,
    ]
  );

  return result.rows[0];
};


export const findStoreByEmail = async (
  email
) => {
  const result = await pool.query(
    `
      SELECT *
      FROM stores
      WHERE email = $1
    `,
    [email]
  );

  return result.rows[0];
};


export const findStoreOwnerById =
  async (ownerId) => {
    const result =
      await pool.query(
        `
        SELECT *
        FROM users
        WHERE id = $1
        AND role = 'STORE_OWNER'
      `,
        [ownerId]
      );

    return result.rows[0];
  };



  export const findStoreByOwner =
  async (ownerId) => {
    const result =
      await pool.query(
        `
        SELECT *
        FROM stores
        WHERE owner_id = $1
      `,
        [ownerId]
      );

    return result.rows[0];
  };


  export const getStores = async ({
  name,
  address,
  sortBy = "name",
  order = "ASC",
  page = 1,
  limit = 10,
}) => {
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const pageLimit = Math.max(1, parseInt(limit, 10) || 10);
  const offset = (currentPage - 1) * pageLimit;

  let baseQuery = `
    FROM stores s

    LEFT JOIN users u
      ON s.owner_id = u.id

    LEFT JOIN ratings r
      ON s.id = r.store_id

    WHERE 1=1
  `;

  const values = [];
  let count = 1;

  if (name) {
    baseQuery += ` AND s.name ILIKE $${count++}`;
    values.push(`%${name}%`);
  }

  if (address) {
    baseQuery += ` AND s.address ILIKE $${count++}`;
    values.push(`%${address}%`);
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
    values
  );

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
      s.email,
      s.address,
      u.name AS owner_name,

      ROUND(
        COALESCE(
          AVG(r.rating),
          0
        ),
        1
      ) AS rating
    ${baseQuery}
    GROUP BY s.id, u.name
  `;

  const allowedSortFields = [
    "name",
    "email",
    "address",
    "rating",
  ];

  if (allowedSortFields.includes(sortBy)) {
    if (sortBy === "rating") {
      query += ` ORDER BY ROUND(COALESCE(AVG(r.rating), 0), 1) ${
        order === "DESC" ? "DESC" : "ASC"
      }`;
    } else {
      query += ` ORDER BY ${sortBy} ${
        order === "DESC" ? "DESC" : "ASC"
      }`;
    }
  }

  query += ` LIMIT $${count++} OFFSET $${count++}`;

  const result =
    await pool.query(query, [
      ...values,
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


export const getStoreById = async (
  storeId
) => {
  const result =
    await pool.query(
      `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,

        u.name AS owner_name,

        ROUND(
          COALESCE(
            AVG(r.rating),
            0
          ),
          1
        ) AS rating

      FROM stores s

      JOIN users u
        ON s.owner_id = u.id

      LEFT JOIN ratings r
        ON s.id = r.store_id

      WHERE s.id = $1

      GROUP BY
        s.id,
        u.name
    `,
      [storeId]
    );

  return result.rows[0];
};