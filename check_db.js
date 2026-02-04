const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const stages = await prisma.stage.findMany({
            orderBy: { sequenceOrder: 'asc' },
        });
        stages.forEach(s => console.log(`${s.sequenceOrder}: ${s.title} (${s.slug}) -> ${s.status}`));
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}
main();
