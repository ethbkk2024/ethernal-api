const express = require('express');

const missionController = require('../controllers/missionController');

const router = express.Router();

router.post('/', missionController.createMission);
router.get('/', missionController.getAllMissions);
router.get('/:id', missionController.getMissionById);
router.put('/:id', missionController.updateMission);
router.delete('/:id', missionController.deleteMission);

router.post('/log', missionController.createMissionLog);

module.exports = router;
