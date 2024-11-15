const { PrismaClient } = require('@prisma/client');

const jwt = require('../middlewares/jwt');

const prisma = new PrismaClient();

const startMatch = async (req, battleLevel) => {
  const user = await jwt.getInfo(req);
  const match = await prisma.match.create({
    data: {
      battle_level: battleLevel,
      user_id: user.user_id,
      match_id: req.body.battle_id,
    },
  });

  return match;
};

const battleCalculate = async (player, boss) => {
  const actionList = [];
  do {
    if (player.is_turn) {
      const damage = player.atk - boss.def / 2;
      boss.hp -= damage;
      actionList.push({
        maxHp: boss.max_hp,
        attacker: 'player',
        damage,
        hp: boss.hp,
      });
      player.is_turn = false;
      boss.is_turn = true;
    } else {
      const damage = boss.atk - player.def / 2;
      player.hp -= damage;
      actionList.push({
        maxHp: player.max_hp,
        attacker: 'boss',
        damage,
        hp: player.hp,
      });
      player.is_turn = true;
      boss.is_turn = false;
    }
  } while (player.hp > 0 && boss.hp > 0);
  const summary = {
    winner: player.hp > 0 ? 'player' : 'boss',
  };
  return { actionList, summary };
};

const getMatchById = async (matchId) => {
  const match = await prisma.match.findUnique({
    where: {
      id: matchId,
    },
  });

  const player = {
    max_hp: 150,
    hp: 150,
    atk: 15,
    def: 12,
    is_turn: true,
  };

  const boss = {
    max_hp: 200,
    hp: 200,
    atk: 25,
    def: 15,
    is_turn: false,
  };

  const initialStat = {
    player: {
      max_hp: player.max_hp,
      hp: player.hp,
      atk: player.atk,
      def: player.def,
    },
    boss: {
      max_hp: boss.max_hp,
      hp: boss.hp,
      atk: boss.atk,
      def: boss.def,
    },
  };
  const data = await battleCalculate(player, boss);
  const response = {
    action_list: data.actionList,
    summary: data.summary,
    initialStat,
  };
  return response;
};

module.exports = {
  startMatch,
  getMatchById,
};
