import { Router } from 'express';
import Event from '../models/Event.js';
import { requireAdmin } from '../middleware/auth.js';
const router = Router();
// ============================================================
// GET /api/events — Public (User & Admin)
// Returns all events sorted by most recently created
// ============================================================
router.get('/', async (_req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        return res.status(200).json({
            status: 'success',
            message: 'Events fetched successfully',
            data: events,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: error.message,
        });
    }
});
// ============================================================
// POST /api/events — Admin only
// Creates a new event with input validation
// ============================================================
router.post('/', requireAdmin, async (req, res) => {
    try {
        const { title, date, price, location, quota, description } = req.body;
        const createdBy = req.adminWallet;
        // Input validation
        const errors = [];
        if (!title || typeof title !== 'string')
            errors.push('title wajib diisi');
        if (!date)
            errors.push('date wajib diisi');
        if (price === undefined || typeof price !== 'number' || price <= 0) {
            errors.push('harga wajib bernilai positif');
        }
        if (!location || typeof location !== 'string')
            errors.push('location wajib diisi');
        if (quota === undefined || typeof quota !== 'number' || quota < 1) {
            errors.push('quota minimal 1');
        }
        if (errors.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Validasi gagal',
                errors,
            });
        }
        // Parse & validate date is in the future
        const eventDate = new Date(date);
        if (isNaN(eventDate.getTime())) {
            return res.status(400).json({
                status: 'error',
                message: 'Tanggal tidak valid',
            });
        }
        if (eventDate.getTime() <= Date.now()) {
            return res.status(400).json({
                status: 'error',
                message: 'Tanggal acara harus di masa depan',
            });
        }
        const event = new Event({
            title,
            date: eventDate,
            price,
            location,
            quota,
            description: description || '',
            createdBy,
        });
        await event.save();
        return res.status(201).json({
            status: 'success',
            message: 'Acara berhasil dibuat',
            data: event,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: error.message,
        });
    }
});
// ============================================================
// DELETE /api/events/:id — Admin only
// Deletes an event by its database ID
// ============================================================
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const eventId = Array.isArray(id) ? id[0] : id;
        if (!eventId || !eventId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID acara tidak valid',
            });
        }
        const deleted = await Event.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                status: 'error',
                message: 'Acara tidak ditemukan',
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Acara berhasil dihapus',
            data: { id },
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: error.message,
        });
    }
});
export default router;
