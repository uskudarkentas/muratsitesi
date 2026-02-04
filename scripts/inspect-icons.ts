
import dotenv from 'dotenv';
dotenv.config();

import { db } from "../src/lib/db";

async function main() {
    try {
        const stages = await db.stage.findMany({
            orderBy: { sequenceOrder: 'asc' }
        });
        console.log("Analyzing Stage Icons:");
        stages.forEach(s => {
            console.log(`[${s.id}] ${s.title} -> IconKey: "${s.iconKey}" (Slug: ${s.slug})`);
        });
    } catch (e) {
        console.error(e);
    }
}

main();
