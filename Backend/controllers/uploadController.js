const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const safeOriginal = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
        const ext = path.extname(safeOriginal) || '.jpg';
        const base = path.basename(safeOriginal, ext) || 'team-image';
        cb(null, `${base}-${Date.now()}${ext.toLowerCase()}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
};

const uploadTeamImage = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');

const mediaStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const safeOriginal = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
        const ext = path.extname(safeOriginal) || (file.mimetype.startsWith('video/') ? '.mp4' : '.jpg');
        const base = path.basename(safeOriginal, ext) || 'portfolio-media';
        cb(null, `${base}-${Date.now()}${ext.toLowerCase()}`);
    },
});

const portfolioMediaFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
        return cb(new Error('Only image and video files are allowed'));
    }
    cb(null, true);
};

const uploadPortfolioMedia = multer({
    storage: mediaStorage,
    fileFilter: portfolioMediaFilter,
    limits: { fileSize: 50 * 1024 * 1024 },
}).single('media');

const handleTeamImageUpload = (req, res) => {
    uploadTeamImage(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Upload failed' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const protocol = req.get('x-forwarded-proto') || req.protocol;
        const host = req.get('x-forwarded-host') || req.get('host');
        const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        return res.status(201).json({ imageUrl });
    });
};

const handlePortfolioMediaUpload = (req, res) => {
    uploadPortfolioMedia(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Upload failed' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const protocol = req.get('x-forwarded-proto') || req.protocol;
        const host = req.get('x-forwarded-host') || req.get('host');
        const mediaUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';

        return res.status(201).json({ mediaUrl, mediaType });
    });
};

module.exports = { handleTeamImageUpload, handlePortfolioMediaUpload };
