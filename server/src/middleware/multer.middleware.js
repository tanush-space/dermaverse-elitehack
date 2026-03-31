const multer = require("multer");

// Use memory storage for all uploads to avoid disk writes.
const memoryStorage = multer.memoryStorage();

// File filter for images only.
const fileFilter = (req, file, cb) => {
    console.log('🖼️ Multer fileFilter - checking file:', file.originalname, 'mime:', file.mimetype);
    if (file.mimetype.startsWith('image/')) {
        console.log('✅ File accepted');
        cb(null, true);
    } else {
        console.error('❌ File rejected - not an image');
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: memoryStorage,
    fileFilter,
    limits: {
        fileSize: 3 * 1024 * 1024, // 3MB limit
    },
});

const uploadMemory = multer({
    storage: memoryStorage,
    fileFilter,
    limits: {
        fileSize: 3 * 1024 * 1024, // 3MB limit
    },
});

module.exports = { upload, uploadMemory };