
import dotenv from 'dotenv';
dotenv.config();

import { db } from "../src/lib/db";

async function main() {
    try {
        console.log("Fixing invalid icons...");

        // Fix file-text -> article
        await db.stage.updateMany({
            where: { iconKey: "file-text" },
            data: { iconKey: "article" }
        });

        // Fix users -> groups
        await db.stage.updateMany({
            where: { iconKey: "users" },
            data: { iconKey: "groups" }
        });

        console.log("Icons fixed.");
    } catch (e) {
        console.error(e);
    }
}

main();
