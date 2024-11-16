const pvpService = require('../services/pvpService');

const startMatch = async (req, res) => {
  try {
    const response = await pvpService.startMatch(req, req.body.battle_level);
    res.status(200).json({ message: 'Match started', data: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMatchById = async (req, res) => {
  try {
    const response = await pvpService.getMatchById(Number(req.params.id));
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMatchListByUserId = async (req, res) => {
  try {
    const response = await pvpService.getMatchByUserId(req);
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMatchDetailById = async (req, res) => {
  try {
    const response = await pvpService.getMatchDetailById(Number(req.params.id));
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  startMatch,
  getMatchById,
  getMatchListByUserId,
  getMatchDetailById,
};
