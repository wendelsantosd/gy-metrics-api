import { PrismaClient, Metric } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  const data: Metric = {
    id: 216743,
    name: 'Energia Gerada por Microinversores',
    created_at: new Date(),
    updated_at: new Date(),
  };

  await prisma.metric.create({
    data,
  });

  console.log('Seed data inserted successfully');
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
