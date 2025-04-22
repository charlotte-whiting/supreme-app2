import pkg from "pg";

// TODO: Check env variable DATABASE_URL in render to ensure it's the right one
export default async function handler(req, res) {
  const { Pool } = pkg;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const { rows } = await pool.query("SELECT * FROM first_attempt.comics");
  res.json(rows);
  console.log(rows);
}
