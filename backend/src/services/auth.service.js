import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const query = `
    SELECT * 
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
};

export const createUser = async ({
  name,
  email,
  password,
  address,
}) => {
  const query = `
    INSERT INTO users
    (name,email,password,address)
    VALUES ($1,$2,$3,$4)
    RETURNING id,name,email,address,role
  `;

  const result = await pool.query(query, [
    name,
    email,
    password,
    address,
  ]);

  return result.rows[0];
};


export const findUserById = async (
  userId
) => {
  const result = await pool.query(
    `
      SELECT *
      FROM users
      WHERE id = $1
    `,
    [userId]
  );

  return result.rows[0];
};

export const updatePassword =
  async (
    userId,
    hashedPassword
  ) => {
    await pool.query(
      `
      UPDATE users
      SET password = $1
      WHERE id = $2
      `,
      [
        hashedPassword,
        userId,
      ]
    );
  };