const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    try {
        console.log('=== STAGES ===');
        const stages = await prisma.stage.findMany({
            select: { id: true, title: true, slug: true, isVisible: true },
            orderBy: { sequenceOrder: 'asc' }
        });
        console.log(JSON.stringify(stages, null, 2));

        console.log('\n=== PAGE CONTENTS ===');
        const pages = await prisma.pageContent.findMany({
            select: { slug: true, isTemplate: true }
        });
        console.log(JSON.stringify(pages, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
