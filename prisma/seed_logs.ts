import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding  logs...');

    // 1. Find or Create an Admin User
    let adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });

    if (!adminUser) {
        console.log('No Admin found. Creating a dummy Admin user...');
        adminUser = await prisma.user.create({
            data: {
                email: 'admin@muratsitesi.com',
                fullName: 'Sistem Yöneticisi',
                role: 'ADMIN',
                passwordHash: 'dummy', // Not for login, just for FK
            }
        });
    }

    console.log(`Using Admin: ${adminUser.fullName} (${adminUser.id})`);

    // 2. Define the 5 specific logs we want to see
    const logsToCreate = [
        {
            action: 'CREATE_POST',
            targetId: 'Duyuru: Otopark İnşaatı',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        },
        {
            action: 'PUBLISH_SURVEY',
            targetId: 'Anket: Havuz Bakımı',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        },
        {
            action: 'UPDATE_STAGE',
            targetId: 'Aşama: Blok Güçlendirme',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        },
        {
            action: 'ADD_BLOCK',
            targetId: 'Anasayfa: Hero Bölümü',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
        {
            action: 'UPDATE_PAGE',
            targetId: 'İletişim Sayfası',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        }
    ];

    // 3. Insert Logs
    for (const log of logsToCreate) {
        await prisma.analyticsLog.create({
            data: {
                userId: adminUser.id,
                action: log.action,
                targetId: log.targetId,
                timestamp: log.timestamp,
                actionType: 'ACTION' // Generic type
            }
        });
    }

    console.log('Successfully seeded 5 admin logs!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
