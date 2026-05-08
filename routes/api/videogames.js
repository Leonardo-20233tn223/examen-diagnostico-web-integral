const express = require('express');
const router = express.Router();
const db = require('../../db/database.js');

function validarPayload(body) {
    const nombre = body.nombre?.trim();
    const empresa = body.empresa?.trim();
    const fecha_lanzamiento = body.fecha_lanzamiento;
    const estrellas = Number(body.estrellas);

    if (!nombre || !empresa || !fecha_lanzamiento) {
        return { error: 'Nombre, empresa y fecha de lanzamiento son obligatorios.' };
    }

    if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) {
        return { error: 'La calificación debe ser un número entero entre 1 y 5.' };
    }

    return { nombre, empresa, fecha_lanzamiento, estrellas };
}

router.get('/', (req, res) => {
    db.all("SELECT * FROM videojuegos ORDER BY id ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: "Error en la base de datos" });
        res.json(rows);
    });
});

router.post('/', (req, res) => {
    const validacion = validarPayload(req.body);
    if (validacion.error) {
        return res.status(400).json({ error: validacion.error });
    }

    const { nombre, empresa, fecha_lanzamiento, estrellas } = validacion;
    
    db.run(
        "INSERT INTO videojuegos (nombre, empresa, fecha_lanzamiento, estrellas) VALUES (?, ?, ?, ?)",
        [nombre, empresa, fecha_lanzamiento, estrellas],
        function (err) {
        if (err) return res.status(500).json({ error: "Error al insertar" });
        res.status(201).json({ id: this.lastID, nombre, empresa, fecha_lanzamiento, estrellas });
        }
    );
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM videojuegos WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: "Error en la base de datos" });
        if (!row) return res.status(404).json({ error: "Videojuego no encontrado" });
        res.json(row);
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const validacion = validarPayload(req.body);
    if (validacion.error) {
        return res.status(400).json({ error: validacion.error });
    }

    const { nombre, empresa, fecha_lanzamiento, estrellas } = validacion;

    db.run(
        "UPDATE videojuegos SET nombre = ?, empresa = ?, fecha_lanzamiento = ?, estrellas = ? WHERE id = ?",
        [nombre, empresa, fecha_lanzamiento, estrellas, id],
        function (err) {
        if (err) return res.status(500).json({ error: "Error al actualizar" });
        if (this.changes === 0) return res.status(404).json({ error: "Videojuego no encontrado" });
        res.json({ id, nombre, empresa, fecha_lanzamiento, estrellas });
        }
    );
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM videojuegos WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: "Error al eliminar" });
        if (this.changes === 0) return res.status(404).json({ error: "Videojuego no encontrado" });
        res.json({ message: "Videojuego eliminado correctamente" });
    });
});

module.exports = router;
