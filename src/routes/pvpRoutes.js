const express = require('express');
const pvpController = require('../controllers/pvpController');

const router = express.Router();

router.post('/start', pvpController.startMatch);

module.exports = {
  router,
};
