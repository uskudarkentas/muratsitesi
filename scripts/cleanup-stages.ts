
import dotenv from 'dotenv';
dotenv.config();
import { db } from "../src/lib/db";

async function main() {
    try {
        console.log("Cleaning up duplicate stages...");
        // IDs identified as duplicates of Kurul Süreci
        const idsToDelete = [15, 16, 17, 18, 19];

        const result = await db.stage.deleteMany({
            where: {
                id: {
                    in: idsToDelete
                }
            }
        });

        console.log(`Deleted ${result.count} duplicate stages.`);
    } catch (e) {
        console.error(e);
    }
}

main();
