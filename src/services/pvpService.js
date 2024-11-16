const { PrismaClient } = require('@prisma/client');

const fs = require('fs');
const path = require('path');
const ethers = require('ethers');
const jwt = require('../middlewares/jwt');

const prisma = new PrismaClient();

const contractABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../abi.json'), 'utf8'),
);

const contractAddress =
  process.env.CONTRACT_ADDRESS || '0x6256453174e1E4AAA4f748169822C6279b2B34D3';

const startMatch = async (req, battleLevel) => {
  const user = await jwt.getInfo(req);
  const match = await prisma.match.create({
    data: {
      battle_level: battleLevel,
      user_id: user.user_id,
      match_id: req.body.battle_id,
      nft_detail: JSON.stringify(req.body.player),
    },
  });
  return match;
};

const battleCalculate = async (player, boss) => {
  const actionList = [];
  do {
    if (player.is_turn) {
      const damage = Math.round(player.atk - boss.def / 2);
      boss.hp -= damage;
      actionList.push({
        maxHp: boss.max_hp,
        attacker: 'player',
        damage,
        hp: boss.hp,
      });
      player.is_turn = false;
      boss.is_turn = true;
      if (boss.hp < 0) {
        boss.hp = 0;
      }
    } else {
      const damage = Math.round(boss.atk - player.def / 2);
      player.hp -= damage;
      actionList.push({
        maxHp: player.max_hp,
        attacker: 'boss',
        damage,
        hp: player.hp,
      });
      player.is_turn = true;
      boss.is_turn = false;

      if (player.hp < 0) {
        player.hp = 0;
      }
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

  if (!match) {
    throw new Error('Match not found');
  }

  const nft_detail = JSON.parse(match.nft_detail);
  const player = {
    max_hp: nft_detail.hp,
    hp: nft_detail.hp,
    atk: nft_detail.atk,
    def: nft_detail.def,
    is_turn: true,
  };
  let boss;
  if (match.battle_level === 1) {
    boss = {
      max_hp: 200,
      hp: 200,
      atk: 25,
      def: 15,
      is_turn: false,
    };
  } else if (match.battle_level === 2) {
    boss = {
      max_hp: 400,
      hp: 400,
      atk: 45,
      def: 30,
      is_turn: false,
    };
  } else if (match.battle_level === 3) {
    boss = {
      max_hp: 300,
      hp: 300,
      atk: 35,
      def: 20,
      is_turn: false,
    };
  }
  const initialStat = {
    player: {
      nft_id: nft_detail.nft_id,
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

  const url = 'https://sepolia.base.org';
  const provider = new ethers.providers.JsonRpcProvider(url);
  const privateKey = process.env.PRIVATE_KEY; // Store your private key in .env file
  const wallet = new ethers.Wallet(privateKey, provider);

  // Contract instance
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);
  if (response.summary.winner === 'player') {
    await contract.completeBattle(match.match_id, true);
  }
  return response;
};

module.exports = {
  startMatch,
  getMatchById,
};
