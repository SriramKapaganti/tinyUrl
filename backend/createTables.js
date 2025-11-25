const { pool } = require("./db");

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS links (
        code VARCHAR(8) PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        long_url TEXT NOT NULL,
        clicks INTEGER NOT NULL DEFAULT 0,
        last_clicked TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_links_long_url ON links (lower(long_url));
    `);

    console.log("Tables created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating tables", err);
    process.exit(1);
  }
}

createTables();
