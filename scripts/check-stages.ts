
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const stages = await prisma.stage.findMany({
            orderBy: { sequenceOrder: 'asc' },
            select: { title: true, slug: true, sequenceOrder: true, status: true }
        });
        console.log('STAGES_DATA_START');
        console.log(JSON.stringify(stages, null, 2));
        console.log('STAGES_DATA_END');
    } catch (error) {
        console.error('Error fetching stages:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
