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

router.post('/upload/text', lighthouseController.uploadTextController);

router.post(
  '/upload/json',
  upload.single('file'),
  lighthouseController.uploadJsonFileController,
);

module.exports = router;
