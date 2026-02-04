const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const posts = await prisma.post.findMany({
            include: { stage: true }
        });
        console.log('Total Posts:', posts.length);
        posts.forEach(p => {
            console.log(`- [${p.type}] ${p.title} (Stage: ${p.stage.title}, Date: ${p.eventDate}, Published: ${p.isPublished})`);
        });
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}
main();
