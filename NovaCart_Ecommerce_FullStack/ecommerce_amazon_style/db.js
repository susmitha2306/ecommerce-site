
const Database=require("better-sqlite3");
const path=require("path");
const db=new Database(path.join(__dirname,"data","ecommerce.db"));
db.pragma("foreign_keys = ON");
db.exec(`
CREATE TABLE IF NOT EXISTS categories(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 slug TEXT UNIQUE NOT NULL,
 name TEXT NOT NULL,
 icon TEXT
);
CREATE TABLE IF NOT EXISTS users(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 email TEXT UNIQUE NOT NULL,
 password TEXT NOT NULL,
 role TEXT NOT NULL DEFAULT 'user',
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS products(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 category_slug TEXT NOT NULL,
 title TEXT NOT NULL,
 description TEXT,
 price REAL NOT NULL,
 old_price REAL,
 discount INTEGER DEFAULT 0,
 rating REAL DEFAULT 4.5,
 reviews INTEGER DEFAULT 0,
 stock INTEGER DEFAULT 10,
 image TEXT,
 featured INTEGER DEFAULT 0,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(category_slug) REFERENCES categories(slug)
);
CREATE TABLE IF NOT EXISTS orders(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER NOT NULL,
 total REAL NOT NULL,
 status TEXT DEFAULT 'Placed',
 address TEXT DEFAULT '{}',
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS order_items(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 order_id INTEGER NOT NULL,
 product_id INTEGER NOT NULL,
 quantity INTEGER NOT NULL,
 price REAL NOT NULL,
 FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
 FOREIGN KEY(product_id) REFERENCES products(id)
);
`);
module.exports=db;
