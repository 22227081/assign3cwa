const express = require("express");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// Every capsule route requires a valid JWT
router.use(requireAuth);

// GET /api/capsules
router.get("/", (req, res) => {
    try {
        const db = require("../db");

        const capsules = db.prepare(`
            SELECT *
            FROM capsules
            WHERE user_id = ?
            ORDER BY id DESC
        `).all(req.user.userId);

        res.json(capsules);
    } catch (error) {
        console.error("GET capsules error:", error);
        res.status(500).json({ error: "Failed to fetch capsules" });
    }
});

// POST /api/capsules
router.post("/", (req, res) => {
    try {
        const db = require("../db");

        const {
            project_name,
            prompt_title,
            prompt_version,
            prompt_text,
            response_summary,
            category,
            usefulness,
            reviewed,
            improved,
            screenshot_url,
            notes
        } = req.body;

        if (!project_name || !prompt_title || !prompt_text) {
            return res.status(400).json({
                error: "project_name, prompt_title and prompt_text are required"
            });
        }

        const result = db.prepare(`
            INSERT INTO capsules (
                user_id,
                project_name,
                prompt_title,
                prompt_version,
                prompt_text,
                response_summary,
                category,
                usefulness,
                reviewed,
                improved,
                screenshot_url,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            req.user.userId,
            project_name,
            prompt_title,
            prompt_version || null,
            prompt_text,
            response_summary || null,
            category || null,
            usefulness || null,
            reviewed ? 1 : 0,
            improved ? 1 : 0,
            screenshot_url || null,
            notes || null
        );

        const capsule = db.prepare(`
            SELECT *
            FROM capsules
            WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json(capsule);
    } catch (error) {
        console.error("POST capsule error:", error);
        res.status(500).json({ error: "Failed to create capsule" });
    }
});

// PUT /api/capsules/:id
router.put("/:id", (req, res) => {
    try {
        const db = require("../db");

        const { id } = req.params;

        const {
            project_name,
            prompt_title,
            prompt_version,
            prompt_text,
            response_summary,
            category,
            usefulness,
            reviewed,
            improved,
            screenshot_url,
            notes
        } = req.body;

        const existing = db.prepare(`
            SELECT *
            FROM capsules
            WHERE id = ? AND user_id = ?
        `).get(id, req.user.userId);

        if (!existing) {
            return res.status(404).json({
                error: "Capsule not found"
            });
        }

        db.prepare(`
            UPDATE capsules
            SET
                project_name = ?,
                prompt_title = ?,
                prompt_version = ?,
                prompt_text = ?,
                response_summary = ?,
                category = ?,
                usefulness = ?,
                reviewed = ?,
                improved = ?,
                screenshot_url = ?,
                notes = ?
            WHERE id = ? AND user_id = ?
        `).run(
            project_name ?? existing.project_name,
            prompt_title ?? existing.prompt_title,
            prompt_version ?? existing.prompt_version,
            prompt_text ?? existing.prompt_text,
            response_summary ?? existing.response_summary,
            category ?? existing.category,
            usefulness ?? existing.usefulness,
            reviewed !== undefined ? (reviewed ? 1 : 0) : existing.reviewed,
            improved !== undefined ? (improved ? 1 : 0) : existing.improved,
            screenshot_url ?? existing.screenshot_url,
            notes ?? existing.notes,
            id,
            req.user.userId
        );

        const updated = db.prepare(`
            SELECT *
            FROM capsules
            WHERE id = ? AND user_id = ?
        `).get(id, req.user.userId);

        res.json(updated);
    } catch (error) {
        console.error("PUT capsule error:", error);
        res.status(500).json({ error: "Failed to update capsule" });
    }
});

// DELETE /api/capsules/:id
router.delete("/:id", (req, res) => {
    try {
        const db = require("../db");

        const { id } = req.params;

        const result = db.prepare(`
            DELETE FROM capsules
            WHERE id = ? AND user_id = ?
        `).run(id, req.user.userId);

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Capsule not found"
            });
        }

        res.json({
            message: "Capsule deleted successfully"
        });
    } catch (error) {
        console.error("DELETE capsule error:", error);
        res.status(500).json({ error: "Failed to delete capsule" });
    }
});

module.exports = router;