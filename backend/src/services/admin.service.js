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




export const findUserByEmail = async (email) => {
  const query = `
    SELECT *
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
};

export const createUserByAdmin = async ({
  name,
  email,
  password,
  address,
  role,
}) => {
  const query = `
    INSERT INTO users
    (
      name,
      email,
      password,
      address,
      role
    )
    VALUES ($1,$2,$3,$4,$5)
    RETURNING
    id,
    name,
    email,
    address,
    role,
    created_at
  `;

  const result = await pool.query(query, [
    name,
    email,
    password,
    address,
    role,
  ]);

  return result.rows[0];
};

export const getUsers = async ({
  name,
  email,
  address,
  role,
  sortBy = "created_at",
  order = "DESC",
  page = 1,
  limit = 10,
}) => {
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const pageLimit = Math.max(1, parseInt(limit, 10) || 10);
  const offset = (currentPage - 1) * pageLimit;

  let baseQuery = `
    FROM users
    WHERE 1=1
  `;

  const values = [];
  let count = 1;

  if (name) {
    baseQuery += ` AND name ILIKE $${count++}`;
    values.push(`%${name}%`);
  }

  if (email) {
    baseQuery += ` AND email ILIKE $${count++}`;
    values.push(`%${email}%`);
  }

  if (address) {
    baseQuery += ` AND address ILIKE $${count++}`;
    values.push(`%${address}%`);
  }

  if (role) {
    baseQuery += ` AND role = $${count++}`;
    values.push(role);
  }

  const countQuery = `SELECT COUNT(*) ${baseQuery}`;
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

  const allowedSortFields = [
    "name",
    "email",
    "address",
    "role",
    "created_at",
  ];

  let query = `
    SELECT
      id,
      name,
      email,
      address,
      role,
      created_at
    ${baseQuery}
  `;

  if (allowedSortFields.includes(sortBy)) {
    query += ` ORDER BY ${sortBy} ${
      order === "ASC" ? "ASC" : "DESC"
    }`;
  }

  query += ` LIMIT $${count++} OFFSET $${count++}`;
  const result = await pool.query(query, [
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

export const getUserById = async (id) => {
  const query = `
    SELECT
      u.id,
      u.name,
      u.email,
      u.address,
      u.role,
      u.created_at,
      CASE
        WHEN u.role = 'STORE_OWNER' THEN
          ROUND(
            COALESCE(
              AVG(r.rating),
              0
            ),
            1
          )
        ELSE NULL
      END AS store_rating
    FROM users u
    LEFT JOIN stores s
      ON s.owner_id = u.id
    LEFT JOIN ratings r
      ON r.store_id = s.id
    WHERE u.id = $1
    GROUP BY u.id
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};