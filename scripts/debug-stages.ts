
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:postgres@localhost:5432/muratsitesi?schema=public"
        }
    }
});

async function main() {
    const stages = await prisma.stage.findMany({
        orderBy: { sequenceOrder: 'asc' }
    });
    console.log("Total stages:", stages.length);
    stages.forEach(s => {
        console.log(`[${s.id}] ${s.title} (Slug: ${s.slug}, Order: ${s.sequenceOrder})`);
    });
}

main();
