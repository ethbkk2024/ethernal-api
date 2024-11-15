const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // await prisma.upload_file.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     file_name: 'test_name',
  //     file_hash: 'test_hash',
  //     file_size: 1000,
  //   },
  // });
  // const missions = [
  //   { id: 1, name: 'Filecoin Storage Quest', type: 'filecoin' },
  //   { id: 2, name: 'Sign Transaction Quest', type: 'transaction' },
  //   { id: 3, name: 'Uniswap Trade Quest', type: 'uniswap' },
  // ];
  //
  // await Promise.all(
  //   missions.map((mission) =>
  //     prisma.mission.upsert({
  //       where: { id: mission.id },
  //       update: {
  //         name: mission.name,
  //         type: mission.type,
  //       },
  //       create: {
  //         id: mission.id,
  //         name: mission.name,
  //         type: mission.type,
  //       },
  //     }),
  //   ),
  // );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
