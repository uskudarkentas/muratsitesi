
import dotenv from 'dotenv';
dotenv.config();

import { db } from "../src/lib/db";

async function main() {
    try {
        const stages = await db.stage.findMany({
            orderBy: { sequenceOrder: 'asc' }
        });
        console.log("Total stages:", stages.length);
        stages.forEach(s => {
            console.log(`[${s.id}] ${s.title} (Status: ${s.status}, Order: ${s.sequenceOrder})`);
        });
    } catch (e) {
        console.error(e);
    }
}

main();
