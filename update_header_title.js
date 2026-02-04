const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // 1. Find the stage with slug 'basvuru'
        const stage = await prisma.stage.findUnique({
            where: { slug: 'basvuru' },
        });

        if (!stage) {
            console.error('Stage "basvuru" not found');
            return;
        }

        // 2. Update the stage title and its first block title if it exists
        let content = stage.content;
        if (Array.isArray(content)) {
            content = content.map(block => {
                if (block.type === 'hero') {
                    return {
                        ...block,
                        data: {
                            ...block.data,
                            title: '1. Aşama: Başvuru Aşaması'
                        }
                    };
                }
                return block;
            });
        }

        await prisma.stage.update({
            where: { id: stage.id },
            data: {
                title: '1. Aşama: Başvuru Aşaması',
                content: content
            },
        });

        console.log('Successfully updated "basvuru" stage title to "1. Aşama: Başvuru Aşaması"');
    } catch (error) {
        console.error('Error updating stage:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
