import { db } from './src/lib/db';

async function testUpdate() {
    try {
        console.log("Testing update on Stage ID 1...");
        const result = await db.stage.update({
            where: { id: 1 },
            data: {
                content: [{ id: 'test', type: 'text', value: 'Hello from test script' }]
            }
        });
        console.log("Update success:", result.id);
    } catch (error) {
        console.error("Update failed:", error);
    } finally {
        await db.$disconnect();
    }
}

testUpdate();
