import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Injecting a new log entry...');

    const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });

    if (!adminUser) {
        console.error("No Admin user found!");
        return;
    }

    // Create a log that happened literally just now
    await prisma.analyticsLog.create({
        data: {
            userId: adminUser.id,
            action: 'ADD_BLOCK',
            targetId: 'Footer: Sosyal Medya İkonları',
            timestamp: new Date(), // Current time
            actionType: 'ACTION'
        }
    });

    console.log('New log injected successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
