
import { getProjectUpdates } from './src/lib/actions/project-updates';

async function main() {
    try {
        console.log("Testing server action...");
        const updates = await getProjectUpdates();
        console.log(`Action returned ${updates.length} items`);
        console.log("First item:", updates[0]);
    } catch (e) {
        console.error("Action Error:", e);
    }
}

main();
