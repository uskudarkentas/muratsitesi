import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding device analytics with specific distributions...');

    // Optionally clean up old data if you want a fresh start
    // await prisma.analyticsLog.deleteMany({
    //     where: {
    //         OR: [
    //             { action: { contains: 'DUYURU' } },
    //             { action: { contains: 'ANKET' } },
    //             { action: { contains: 'TOPLANTI' } }
    //         ]
    //     }
    // });

    // Function to generate data based on distribution
    const generateData = async (category: string, count: number, dist: { mobile: number, desktop: number, tablet: number }) => {
        console.log(`Generating ${count} records for ${category}...`);

        const mobileCount = Math.floor(count * dist.mobile);
        const desktopCount = Math.floor(count * dist.desktop);
        const tabletCount = count - mobileCount - desktopCount; // Rest goes to tablet

        const entries = [];

        // Mobile
        for (let i = 0; i < mobileCount; i++) entries.push({ action: `${category}_VIEW`, actionType: 'VIEW', device: 'MOBILE', timestamp: new Date() });
        // Desktop
        for (let i = 0; i < desktopCount; i++) entries.push({ action: `${category}_VIEW`, actionType: 'VIEW', device: 'DESKTOP', timestamp: new Date() });
        // Tablet
        for (let i = 0; i < tabletCount; i++) entries.push({ action: `${category}_VIEW`, actionType: 'VIEW', device: 'TABLET', timestamp: new Date() });

        // Save in chunks to avoid huge connection pool usage
        await prisma.analyticsLog.createMany({
            data: entries
        });
    };

    // 1. Duyuru Analizleri (Mobile: 68%, Desktop: 24%, Tablet: 8%) - Let's do 100 entries
    await generateData('DUYURU', 100, { mobile: 0.68, desktop: 0.24, tablet: 0.08 });

    // 2. Anket Analizleri (Mobile: 85%, Desktop: 10%, Tablet: 5%) - Let's do 80 entries
    await generateData('ANKET', 80, { mobile: 0.85, desktop: 0.10, tablet: 0.05 });

    // 3. Toplantı Analizleri (Mobile: 50%, Desktop: 40%, Tablet: 10%) - Let's do 60 entries
    await generateData('TOPLANTI', 60, { mobile: 0.50, desktop: 0.40, tablet: 0.10 });

    console.log('Device analytics seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
