const { PrismaClient } = require('@prisma/client');
const { v4: uuidV4 } = require('uuid');

const jwt = require('../middlewares/jwt');

const prisma = new PrismaClient();

const startMatch = async (req, battleLevel) => {
  const user = await jwt.getInfo(req);
  const match = await prisma.match.create({
    data: {
      battle_level: battleLevel,
      user_id: user.user_id,
      match_id: uuidV4(),
    },
  });

  return match;
};

module.exports = {
  startMatch,
};
