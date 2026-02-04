const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const stages = await prisma.stage.findMany({
            orderBy: { sequenceOrder: 'asc' },
        });

        console.log('Current Stages:');
        stages.forEach(s => console.log(`${s.sequenceOrder}: ${s.title} (${s.slug})`));

        // Re-ordering to ensure no gaps
        for (let i = 0; i < stages.length; i++) {
            const newOrder = i + 1;
            if (stages[i].sequenceOrder !== newOrder) {
                console.log(`Updating ${stages[i].title}: ${stages[i].sequenceOrder} -> ${newOrder}`);
                await prisma.stage.update({
                    where: { id: stages[i].id },
                    data: { sequenceOrder: newOrder }
                });
            }
        }

        console.log('Re-ordering complete.');
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}
main();
