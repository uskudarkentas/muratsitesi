const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const result = await prisma.stage.deleteMany({
            where: {
                OR: [
                    { slug: 'surec' },
                    { title: { contains: 'Süreç' } }
                ]
            }
        });
        console.log(`Successfully deleted ${result.count} stage(s) related to 'Süreç'`);
    } catch (error) {
        console.error('Error deleting stage:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
