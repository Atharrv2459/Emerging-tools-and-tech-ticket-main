import bcrypt from 'bcrypt';
import pool from './db.js';

export const bootstrapAdmin = async () => {
  const adminExists = await pool.query(`
    SELECT 1 FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE r.role_name = 'admin'
  `);

  if (adminExists.rows.length > 0) return;

  const role = await pool.query(
    `SELECT id FROM roles WHERE role_name = 'admin'`
  );

  const hash = await bcrypt.hash(
    process.env.INITIAL_ADMIN_PASSWORD,
    10
  );

  await pool.query(
    `INSERT INTO users (name, email, password_hash, role_id)
     VALUES ($1, $2, $3, $4)`,
    [
      process.env.INITIAL_ADMIN_NAME,
      process.env.INITIAL_ADMIN_EMAIL,
      hash,
      role.rows[0].id
    ]
  );

  console.log('✅ Initial admin created');
};
