
const { PrismaClient } = require('@prisma/client');
const path = require('path');
// Try to load dotenv, fail gracefully if not found (assuming built-in env handling might work differently)
try {
    require('dotenv').config({ path: path.join(__dirname, '../.env') });
} catch (e) {
    console.log('dotenv not found or error loading:', e.message);
}

const prisma = new PrismaClient();

async function main() {
    console.log('Testing Post Creation and Fetching...');

    try {
        // 1. Get first stage
        const stage = await prisma.stage.findFirst();
        if (!stage) {
            console.error('No stages found!');
            return;
        }
        console.log('Found Stage:', stage.title, '(ID:', stage.id, ')');

        // 2. Create Post manually
        const newPost = await prisma.post.create({
            data: {
                stageId: stage.id,
                title: "Test Duyuru Script",
                content: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Script tarafından oluşturuldu." } }] }),
                type: "ANNOUNCEMENT",
                isPublished: true
            }
        });
        console.log('Post Created:', newPost.id);

        // 3. Fetch Stages with Posts
        const stagesWithPosts = await prisma.stage.findMany({
            where: { id: stage.id },
            include: {
                posts: true
            }
        });

        console.log('Fetched Stage Posts:', JSON.stringify(stagesWithPosts[0].posts, null, 2));

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
