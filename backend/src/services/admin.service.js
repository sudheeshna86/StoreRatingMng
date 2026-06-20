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
}) => {
  let query = `
    SELECT
      id,
      name,
      email,
      address,
      role,
      created_at
    FROM users
    WHERE 1=1
  `;

  const values = [];
  let count = 1;

  if (name) {
    query += ` AND name ILIKE $${count++}`;
    values.push(`%${name}%`);
  }

  if (email) {
    query += ` AND email ILIKE $${count++}`;
    values.push(`%${email}%`);
  }

  if (address) {
    query += ` AND address ILIKE $${count++}`;
    values.push(`%${address}%`);
  }

  if (role) {
    query += ` AND role = $${count++}`;
    values.push(role);
  }

  const allowedSortFields = [
    "name",
    "email",
    "created_at",
  ];

  if (allowedSortFields.includes(sortBy)) {
    query += ` ORDER BY ${sortBy} ${
      order === "ASC" ? "ASC" : "DESC"
    }`;
  }

  const result = await pool.query(
    query,
    values
  );

  return result.rows;
};

export const getUserById = async (id) => {
  const query = `
    SELECT
      id,
      name,
      email,
      address,
      role,
      created_at
    FROM users
    WHERE id = $1
  `;

  const result = await pool.query(
    query,
    [id]
  );

  return result.rows[0];
};