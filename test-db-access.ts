
import { db } from './src/lib/db';

async function main() {
    try {
        console.log("Testing db singleton access...");
        const count = await db.projectUpdate.count();
        console.log(`db.projectUpdate count: ${count}`);
        const items = await db.projectUpdate.findMany({ take: 1 });
        console.log("First item:", items[0]);
    } catch (e) {
        console.error("DB Access Error:", e);
    } finally {
        await db.$disconnect();
    }
}

main();
