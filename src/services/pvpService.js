const { PrismaClient } = require('@prisma/client');
const { ncrypt } = require('ncrypt-js');
const fs = require('fs');
const path = require('path');
const ethers = require('ethers');
const { privateKeyToAccount } = require('viem/accounts');
const { SignProtocolClient, SpMode, EvmChains } = require('@ethsign/sp-sdk');
const jwt = require('../middlewares/jwt');

const prisma = new PrismaClient();

const contractABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../abi.json'), 'utf8'),
);

const contractAddress =
  process.env.CONTRACT_ADDRESS || '0x6256453174e1E4AAA4f748169822C6279b2B34D3';

const privateKey = process.env.PRIVATE_KEY;
const _secretKey = process.env.ENCRYPT_KEY || 'some-super-secret-key';
const ncryptObject = new ncrypt(_secretKey);

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
    include: {
      user: true,
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

  const url = 'https://spicy-rpc.chiliz.com';
  const provider = new ethers.providers.JsonRpcProvider(url);
  const wallet = new ethers.Wallet(privateKey, provider);

  // Contract instance
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);
  if (response.summary.winner === 'player') {
    await contract.completeBattle(match.match_id, true);
  }
  // const privateKey = `0x${process.env.PRIVATE_KEY}`;
  const account = await privateKeyToAccount(`0x${privateKey}`);
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.baseSepolia,
    account, // Optional, depending on environment
  });

  const createAttestationRes = await client.createAttestation({
    schemaId: '0x4a1',
    data: {
      id: match.id,
      address: match.user.wallet_address,
      winner: response.summary.winner === 'player',
      action_list: ncryptObject.encrypt(response.action_list),
      initialStat: ncryptObject.encrypt(response.initialStat),
    },
    indexingValue: match.user.wallet_address,
    recipients: [match.user.wallet_address],
  });
  await prisma.match.update({
    where: {
      id: match.id,
    },
    data: {
      attestations_id: createAttestationRes.attestationId,
    },
  });
  return response;
};

const getMatchByUserId = async (req) => {
  const user = await jwt.getInfo(req);
  const match = await prisma.match.findMany({
    where: {
      user_id: user.user_id,
    },
  });
  const returnData = [];
  for (let i = 0; i < match.length; i++) {
    const matchDetail = {
      id: match[i].id,
      battle_level: match[i].battle_level,
      user: match[i].user,
      attestations_id: match[i].attestations_id,
      nft_detail: JSON.parse(match[i].nft_detail),
    };
    returnData.push(matchDetail);
  }

  return returnData;
};

const getMatchDetailById = async (matchId) => {
  const match = await prisma.match.findUnique({
    where: {
      id: matchId,
    },
  });
  const account = await privateKeyToAccount(`0x${privateKey}`);
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.baseSepolia,
    account, // Optional, depending on environment
  });

  const matchDetail = await client.getAttestation(match.attestations_id);
  let winner;
  if (matchDetail.data.winner) {
    winner = 'player';
  } else {
    winner = 'boss';
  }
  return {
    action_list: ncryptObject.decrypt(matchDetail.data.action_list),
    summary: {
      winner,
    },
    initialStat: ncryptObject.decrypt(matchDetail.data.initialStat),
  };
};

module.exports = {
  startMatch,
  getMatchById,
  getMatchByUserId,
  getMatchDetailById,
};
