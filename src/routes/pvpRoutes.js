const express = require('express');
const pvpController = require('../controllers/pvpController');

const router = express.Router();

router.post('/start', pvpController.startMatch);
router.get('/:id', pvpController.getMatchById);

module.exports = {
  router,
};
