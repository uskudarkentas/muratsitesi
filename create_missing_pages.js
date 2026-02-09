const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createMissingPageContent() {
    try {
        // Get all stages
        const stages = await prisma.stage.findMany({
            orderBy: { sequenceOrder: 'asc' }
        });

        console.log(`Found ${stages.length} stages`);

        // Get existing page contents
        const existingPages = await prisma.pageContent.findMany({
            select: { slug: true }
        });
        const existingSlugs = new Set(existingPages.map(p => p.slug));

        console.log(`Found ${existingPages.length} existing page contents`);

        // Create missing page contents
        let created = 0;
        for (const stage of stages) {
            if (!existingSlugs.has(stage.slug)) {
                console.log(`Creating page content for: ${stage.slug} (${stage.title})`);

                // Create default content blocks for the stage
                const defaultBlocks = [
                    {
                        id: `hero-${stage.slug}`,
                        type: 'hero',
                        order: 0,
                        content: {
                            title: stage.title,
                            subtitle: stage.description || `${stage.title} hakkında detaylı bilgi`,
                            backgroundImage: ''
                        }
                    },
                    {
                        id: `text-${stage.slug}`,
                        type: 'text',
                        order: 1,
                        content: {
                            text: '<p>Bu sayfa için içerik henüz eklenmemiş. Lütfen admin panelinden içerik ekleyin.</p>'
                        }
                    }
                ];

                // Convert blocks to JSON string
                const blocksJson = JSON.stringify(defaultBlocks);

                await prisma.pageContent.create({
                    data: {
                        slug: stage.slug,
                        blocks: blocksJson,
                        isTemplate: false
                    }
                });

                created++;
            }
        }

        console.log(`\n✅ Created ${created} new page contents`);
        console.log(`✅ Total page contents: ${existingPages.length + created}`);

    } catch (error) {
        console.error('Error:', error.message);
        console.error('Full error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createMissingPageContent();
