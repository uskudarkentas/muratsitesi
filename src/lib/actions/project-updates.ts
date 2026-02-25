"use server";

import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getProjectUpdates(limit: number = 5) {
    try {
        console.log("getProjectUpdates: Starting fetch...");

        let updates;
        try {
            // Attempt 1: Shared DB
            if (db && db.projectUpdate) {
                console.log("Using shared DB client");
                updates = await db.projectUpdate.findMany({
                    orderBy: { createdAt: "desc" },
                    take: limit,
                });
            } else {
                throw new Error("Shared DB client invalid");
            }
        } catch (dbError) {
            console.error("Shared DB failed, trying fallback client...", dbError);
            // Attempt 2: Fresh Client
            const prisma = new PrismaClient();
            updates = await prisma.projectUpdate.findMany({
                orderBy: { createdAt: "desc" },
                take: limit,
            });
            await prisma.$disconnect();
        }

        console.log(`getProjectUpdates found ${updates?.length} items`);
        revalidatePath("/admin");
        return updates || [];
    } catch (error) {
        console.error("CRITICAL ERROR in getProjectUpdates:", error);
        return [];
    }
}

export async function recordProjectUpdate(data: {
    title: string;
    description: string;
    type: 'EKLENDI' | 'GUNCELLENDI' | 'YAYINLANDI' | 'TAMAMLANDI';
    category: string;
}) {
    try {
        await db.projectUpdate.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                category: data.category,
                createdAt: new Date()
            }
        });
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to record project update:", error);
        return { success: false, error };
    }
}
