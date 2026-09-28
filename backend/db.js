const Database = require("better-sqlite3");

const db = new Database("ai_capsule.db");

db.pragma("foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS capsules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        project_name TEXT NOT NULL,
        prompt_title TEXT NOT NULL,
        prompt_version TEXT,
        prompt_text TEXT NOT NULL,
        response_summary TEXT,
        category TEXT,
        usefulness TEXT,
        reviewed INTEGER DEFAULT 0,
        improved INTEGER DEFAULT 0,
        screenshot_url TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

console.log("Database initialized successfully");

module.exports = db;