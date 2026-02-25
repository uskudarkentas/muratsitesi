import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking analytics counts...');

    const total = await prisma.analyticsLog.count();
    console.log(`Total Analytics Logs: ${total}`);

    const duyuru = await prisma.analyticsLog.count({ where: { action: { contains: 'DUYURU' } } });
    console.log(`Duyuru Logs: ${duyuru}`);

    const anket = await prisma.analyticsLog.count({ where: { action: { contains: 'ANKET' } } });
    console.log(`Anket Logs: ${anket}`);

    const toplanti = await prisma.analyticsLog.count({ where: { action: { contains: 'TOPLANTI' } } });
    console.log(`Toplanti Logs: ${toplanti}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
