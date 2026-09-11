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
            meta: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: 'Gagal fetch events', error: error.message });
    }
});
// GET /api/events/:id — Detail with quota per tier
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).lean().exec();
        if (!event)
            return res.status(404).json({ status: 'error', message: 'Acara tidak ditemukan' });
        return res.status(200).json({ status: 'success', data: event });
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});
// POST /api/events — Create with full schema
router.post('/', requireAdmin, async (req, res) => {
    try {
        const { title, slug, category, startDate, endDate, location, bannerUrl, description, tiers } = req.body;
        const createdBy = req.adminWallet;
        if (!title || !slug || !category || !startDate || !endDate || !location || !tiers?.length) {
            return res.status(400).json({ status: 'error', message: 'Parameter wajib: title, slug, category, startDate, endDate, location, tiers[]' });
        }
        const totalQuota = tiers.reduce((sum, t) => sum + (t.quota || 0), 0);
        if (totalQuota < 1) {
            return res.status(400).json({ status: 'error', message: 'Total quota minimal 1' });
        }
        const validTiers = tiers.map((t) => ({
            tierId: t.tierId || `tier-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            tierName: t.tierName,
            price: t.price ?? 0,
            quota: t.quota,
            sold: 0,
            maxPerWallet: t.maxPerWallet ?? 2,
            perks: Array.isArray(t.perks) ? t.perks : [],
            customFields: Array.isArray(t.customFields) ? t.customFields : [],
        }));
        const event = await Event.create({
            title,
            slug: slug.toLowerCase().replace(/\s+/g, '-'),
            category,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            location,
            bannerUrl: bannerUrl || '',
            description: description || '',
            createdBy,
            status: 'Draft',
            tiers: validTiers,
        });
        return res.status(201).json({ status: 'success', data: event });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ status: 'error', message: 'Slug sudah digunakan' });
        }
        return res.status(500).json({ status: 'error', message: error.message });
    }
});
// POST /api/events/:id/buy-intent — Reserve slot (race-condition safe)
router.post('/:id/buy-intent', async (req, res) => {
    try {
        const { tierId, wallet, quantity = 1 } = req.body;
        if (!tierId || !wallet)
            return res.status(400).json({ status: 'error', message: 'tierId & wallet wajib' });
        const event = await Event.findById(req.params.id);
        if (!event)
            return res.status(404).json({ status: 'error', message: 'Acara tidak ditemukan' });
        const tierIndex = event.tiers.findIndex(t => t.tierId === tierId);
        if (tierIndex === -1)
            return res.status(404).json({ status: 'error', message: 'Tier tidak ditemukan' });
        const tier = event.tiers[tierIndex];
        const available = tier.quota - tier.sold;
        if (available < quantity)
            return res.status(400).json({ status: 'error', message: `Kuota tidak cukup (tersisa ${available})` });
        if (quantity > tier.maxPerWallet)
            return res.status(400).json({ status: 'error', message: `Maksimal ${tier.maxPerWallet} per wallet` });
        // Atomic increment sold
        tier.sold += quantity;
        event.markModified('tiers');
        await event.save();
        return res.status(200).json({
            status: 'success',
            data: { eventId: event._id, tierId, quantity, remaining: available - quantity },
        });
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});
export default router;
