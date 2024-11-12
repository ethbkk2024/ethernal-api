const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createMission = async (data) => {
  return prisma.mission.create({
    data,
  });
};

exports.getAllMissions = async () => {
  return prisma.mission.findMany();
};

exports.getMissionById = async (id) => {
  return prisma.mission.findUnique({
    where: { id: parseInt(id, 10) },
  });
};

exports.updateMission = async (id, data) => {
  return prisma.mission.update({
    where: { id: parseInt(id, 10) },
    data,
  });
};

exports.deleteMission = async (id) => {
  return prisma.mission.delete({
    where: { id: parseInt(id, 10) },
  });
};

module.exports = {};
