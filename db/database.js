const sqlite3 = require('sqlite3').verbose();
const PATH = require('path');

const db = new sqlite3.Database(PATH.join(__dirname, 'database.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS videojuegos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    empresa TEXT,
    fecha_lanzamiento TEXT,
    estrellas INTEGER
  )`);

  db.get("SELECT COUNT(*) as count FROM videojuegos", (err, row) => {
    if (row.count === 0) {
      db.run(
        "INSERT INTO videojuegos (nombre, empresa, fecha_lanzamiento, estrellas) VALUES (?, ?, ?, ?)",
        ["The Legend of Zelda: Breath of the Wild", "Nintendo", "2017-03-03", 5]
      );
      db.run(
        "INSERT INTO videojuegos (nombre, empresa, fecha_lanzamiento, estrellas) VALUES (?, ?, ?, ?)",
        ["Halo Infinite", "Xbox Game Studios", "2021-12-08", 4]
      );
    }
  });
});

module.exports = db;
