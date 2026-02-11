import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking for "Anahtar Teslim" stage...');

    // Check if stage exists by slug
    const existingStage = await prisma.stage.findUnique({
        where: { slug: 'anahtar-teslim' }
    });

    if (existingStage) {
        console.log('✅ "Anahtar Teslim" stage already exists.');
        console.log(existingStage);
        return;
    }

    console.log('⚠️ Stage not found. Creating it now...');

    // Create the stage
    const newStage = await prisma.stage.create({
        data: {
            title: "Anahtar Teslim",
            slug: "anahtar-teslim",
            description: "Yeni dairelerin teslimi yapılacak.",
            status: "LOCKED",
            sequenceOrder: 12.0,
            iconKey: "key",
            isVisible: true,
            variant: "default"
        }
    });

    console.log('🎉 Stage created successfully:');
    console.log(newStage);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
