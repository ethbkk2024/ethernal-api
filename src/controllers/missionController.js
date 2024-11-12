const missionService = require('../services/missionService');

const createMission = async (req, res) => {
  try {
    const mission = await missionService.createMission(req.body);
    res.status(201).json(mission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllMissions = async (req, res) => {
  try {
    const missions = await missionService.getAllMissions();
    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMissionById = async (req, res) => {
  try {
    const mission = await missionService.getMissionById(req.params.id);
    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }
    return res.status(200).json(mission);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateMission = async (req, res) => {
  try {
    const mission = await missionService.updateMission(req.params.id, req.body);
    res.status(200).json(mission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMission = async (req, res) => {
  try {
    await missionService.deleteMission(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createMissionLog = async (req, res) => {
  try {
    const missionLog = await missionService.createMissionLog(req.body);
    res.status(201).json(missionLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createMission,
  getAllMissions,
  getMissionById,
  updateMission,
  deleteMission,
  createMissionLog,
};
