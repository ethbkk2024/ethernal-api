const express = require('express');
const lighthouseController = require('../controllers/lighthouseController');
const { upload } = require('../middlewares/multer');

const router = express.Router();

router.get('/api-key', lighthouseController.getApiKeyController);

router.post(
  '/upload',
  upload.single('file'),
  lighthouseController.uploadFileController,
);

module.exports = router;
