import { Router } from 'express';
import Event from '../models/Event.js';
import { requireAdmin } from '../middleware/auth.js';
const router = Router();
const PAGE_LIMIT = 10;
// GET /api/events — Paginated with lean()
router.get('/', async (_req, res) => {
    try {
        const page = Math.max(1, parseInt(_req.query.page || '1'));
        const limit = Math.min(PAGE_LIMIT, parseInt(_req.query.limit || PAGE_LIMIT.toString()));
        const skip = (page - 1) * limit;
        const [events, total] = await Promise.all([
            Event.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            Event.countDocuments({}),
        ]);
        return res.status(200).json({
            status: 'success',
            data: events,
            meta: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Gagal fetch events',
            error: error.message,
        });
    }
});
// POST /api/events — async-safe, no memory buildup
router.post('/', requireAdmin, async (req, res) => {
    try {
        const { title, date, price, location, quota, description } = req.body;
        const createdBy = req.adminWallet;
        if (!title || !date || !price || !location || !quota) {
            return res.status(400).json({ status: 'error', message: 'Parameter wajib diisi' });
        }
        const event = await Event.create({
            title,
            date: new Date(date),
            price,
            location,
            quota,
            description: description || '',
            createdBy,
        });
        return res.status(201).json({ status: 'success', data: event });
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});
export default router;
