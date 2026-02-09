const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixPageContentStructure() {
    try {
        // Get all page contents
        const pages = await prisma.pageContent.findMany();

        console.log(`Found ${pages.length} page contents`);

        let fixed = 0;
        for (const page of pages) {
            const blocks = JSON.parse(page.blocks);
            let needsUpdate = false;

            // Fix each block - rename 'content' to 'data'
            const fixedBlocks = blocks.map(block => {
                if (block.content && !block.data) {
                    needsUpdate = true;
                    return {
                        ...block,
                        data: block.content,
                        content: undefined
                    };
                }
                return block;
            });

            if (needsUpdate) {
                console.log(`Fixing structure for: ${page.slug}`);
                await prisma.pageContent.update({
                    where: { id: page.id },
                    data: {
                        blocks: JSON.stringify(fixedBlocks)
                    }
                });
                fixed++;
            }
        }

        console.log(`\n✅ Fixed ${fixed} page contents`);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

fixPageContentStructure();
