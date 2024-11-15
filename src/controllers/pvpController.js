const pvpService = require('../services/pvpService');

const startMatch = async (req, res) => {
  try {
    const response = await pvpService.startMatch(req, req.body.battle_level);
    res.status(200).json({ message: 'Match started', data: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  startMatch,
};
