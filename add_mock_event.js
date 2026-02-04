const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Find an active stage to attach the event to
        const activeStage = await prisma.stage.findFirst({ where: { status: 'ACTIVE' } });
        if (!activeStage) {
            console.error('No active stage found');
            return;
        }

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10); // 10 days in future
        futureDate.setHours(17, 0, 0, 0);

        const event = await prisma.post.create({
            data: {
                stageId: activeStage.id,
                type: 'MEETING',
                title: 'Bilgilendirme Toplantısı',
                content: JSON.stringify({ blocks: [{ type: 'paragraph', data: { text: 'Tüm sakinlerimizin katılımı rica olunur.' } }] }),
                isPublished: true,
                publishedAt: new Date(),
                eventDate: futureDate
            }
        });

        console.log('Created mock future event:', event.title, 'at', event.eventDate);
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}
main();
