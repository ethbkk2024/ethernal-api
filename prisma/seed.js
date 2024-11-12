const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.upload_file.upsert({
    where: { id: 1 },
    update: {},
    create: {
      file_name: 'test_name',
      file_hash: 'test_hash',
      file_size: 1000,
    },
  });
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
