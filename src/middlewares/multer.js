const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadPath = path.resolve(__dirname, '../uploads');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `lighthouse-${Date.now()}${extension}`);
  },
});

const upload = multer({ storage });

module.exports = { upload };
