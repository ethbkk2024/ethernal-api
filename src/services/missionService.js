const { PrismaClient } = require('@prisma/client');
const jwt = require('../middlewares/jwt');

const prisma = new PrismaClient();

const createMission = async (data) => {
  return prisma.mission.create({
    data: {
      name: data.name,
      type: data.type,
    },
  });
};

const getAllMissions = async () => {
  return prisma.mission.findMany();
};

const getMissionById = async (id) => {
  return prisma.mission.findUnique({
    where: { id: parseInt(id, 10) },
  });
};

const updateMission = async (id, data) => {
  return prisma.mission.update({
    where: { id: parseInt(id, 10) },
    data,
  });
};

const deleteMission = async (id) => {
  return prisma.mission.delete({
    where: { id: parseInt(id, 10) },
  });
};

const createMissionLog = async (req, data) => {
  const user = await jwt.getInfo(req);
  const missionExists = await prisma.mission.findUnique({
    where: { id: data.mission_id },
  });

  if (!missionExists) {
    throw new Error(`Mission with id ${data.mission_id} does not exist.`);
  }

  return prisma.mission_log.create({
    data: {
      user_id: user.user_id,
      mission_id: data.mission_id,
      balance: data.balance,
      status: data.status,
      details: data.details || null,
    },
  });
};

module.exports = {
  createMission,
  getAllMissions,
  getMissionById,
  updateMission,
  deleteMission,
  createMissionLog,
};
