const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ruta de la base de datos
const dbPath = path.resolve(__dirname, 'data', 'db.sqlite');

// Crear carpeta 'data' si no existe
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Conectar a la base de datos
const db = new Database(dbPath);

// Activar soporte de foreign keys
db.pragma('foreign_keys = ON');

// Crear tabla users
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    contraseña TEXT NOT NULL,
    rol TEXT NOT NULL
  )
`).run();

// Crear tabla tasks
db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`).run();

console.log('✅ Base de datos SQLite lista con tablas users y tasks');

module.exports = db;
