import { Router } from 'express';
import fs from 'fs';
import path from 'path';
const router = Router();
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
// Ensure uploads dir exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
// POST /api/upload/banner — stream-based image upload
router.post('/banner', async (req, res) => {
    try {
        if (!req.headers['content-type']?.includes('multipart/form-data')) {
            return res.status(400).json({ status: 'error', message: 'Multipart required' });
        }
        // Read 2MB chunk at a time via streaming
        const chunks = [];
        let total = 0;
        const MAX_SIZE = 2 * 1024 * 1024; // 2MB limit
        await new Promise((resolve, reject) => {
            req.on('data', (chunk) => {
                total += chunk.length;
                if (total > MAX_SIZE) {
                    req.destroy();
                    return reject(new Error('Payload too large'));
                }
                chunks.push(chunk);
            });
            req.on('end', () => resolve());
            req.on('error', reject);
        });
        const filename = `banner-${Date.now()}.jpg`;
        const filepath = path.join(UPLOAD_DIR, filename);
        fs.writeFileSync(filepath, Buffer.concat(chunks));
        return res.status(200).json({ status: 'success', filename });
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});
export default router;
