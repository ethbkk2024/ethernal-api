const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const login = async (walletAddress) => {
  let user = await prisma.users.findUnique({
    where: { wallet_address: walletAddress },
  });

  if (!user) {
    user = await prisma.users.create({
      data: {
        wallet_address: walletAddress,
      },
    });
  }

  // if (!user) {
  //   throw new Error('User not found');
  // }
  return user;
};

module.exports = {
  login,
};
