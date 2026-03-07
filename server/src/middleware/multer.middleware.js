const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Get the absolute path to the uploads directory
const uploadDir = path.join(__dirname, '../../uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Created uploads directory at:', uploadDir);
} else {
    console.log('✅ Uploads directory already exists at:', uploadDir);
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('📁 Multer destination - saving to:', uploadDir);
        // Check if directory is writable
        try {
            if (!fs.accessSync(uploadDir, fs.constants.W_OK)) {
                console.error('❌ Uploads directory is not writable!');
            }
        } catch (e) {
            console.log('✅ Uploads directory is writable');
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        // Create unique filename with timestamp
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        console.log('📄 Multer filename:', uniqueName, 'Original:', file.originalname);
        cb(null, uniqueName);
    }
});

// File filter for images only
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
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = { upload };