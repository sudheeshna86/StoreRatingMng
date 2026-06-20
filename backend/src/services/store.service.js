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
}) => {
  let query = `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,

      ROUND(
        COALESCE(
          AVG(r.rating),
          0
        ),
        1
      ) AS rating

    FROM stores s

    LEFT JOIN ratings r
      ON s.id = r.store_id

    WHERE 1=1
  `;

  const values = [];
  let count = 1;

  if (name) {
    query += ` AND s.name ILIKE $${count++}`;
    values.push(`%${name}%`);
  }

  if (address) {
    query += ` AND s.address ILIKE $${count++}`;
    values.push(`%${address}%`);
  }

  query += `
    GROUP BY s.id
  `;

  const allowedSortFields = [
    "name",
    "email",
  ];

  if (
    allowedSortFields.includes(sortBy)
  ) {
    query += ` ORDER BY ${sortBy} ${
      order === "DESC"
        ? "DESC"
        : "ASC"
    }`;
  }

  const result =
    await pool.query(query, values);

  return result.rows;
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