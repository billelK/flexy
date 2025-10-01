import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbDir = path.join(process.cwd(), "sqlite");
const dbPath = path.join(dbDir, "db.sqlite");

// make sure folder exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    operator TEXT,
    phone TEXT NOT NULL CHECK(phone GLOB '[0-9]*' AND length(phone) = 10),
    amount REAL NOT NULL CHECK (amount > 50),
    status TEXT NOT NULL CHECK (status IN ('Pending','Completed','Failed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();


export default db;


