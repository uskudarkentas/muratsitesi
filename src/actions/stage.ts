"use server";

import { db } from "@/core/database/client";
import { revalidatePath } from "next/cache";

/**
 * Marks a stage as COMPLETED and triggers automation.
 * 
 * Automation Logic:
 * 1. Sets status to 'COMPLETED'
 * 2. Sets progress to 100%
 * 3. Creates a draft ANNOUNCEMENT post for the stage
 */
export async function completeStage(stageId: number) {
    try {
        // 1. Get current stage to ensure it exists and get details
        const stage = await db.stage.findUnique({
            where: { id: stageId },
        });

        if (!stage) {
            throw new Error("Stage not found");
        }

        // 2. Update Stage status and progress
        await db.stage.update({
            where: { id: stageId },
            data: {
                status: "COMPLETED",
                progress: 100,
            },
        });

        // 3. Automation: Create Announcement Post
        // Use autoPostTitle if available, otherwise default
        const title = stage.autoPostTitle || `Bilgilendirme: ${stage.title} Aşaması Tamamlandı`;

        // Default content for Block Editor (EditorJS)
        const defaultContent = JSON.stringify({
            time: Date.now(),
            blocks: [
                {
                    id: "default-block",
                    type: "paragraph",
                    data: {
                        text: `${stage.title} aşaması başarıyla tamamlanmıştır. Süreç ile ilgili detaylı bilgilendirme ve belgeler yakında eklenecektir.`
                    }
                }
            ],
            version: "2.29.0"
        });

        await db.post.create({
            data: {
                stageId: stage.id,
                type: "ANNOUNCEMENT",
                title: title,
                content: defaultContent,
                isPublished: false, // Draft mode - requires Admin review
            },
        });

        // 4. Revalidate paths
        revalidatePath("/admin");
        revalidatePath("/");

        return { success: true, message: "Aşama tamamlandı ve otomatik duyuru taslağı oluşturuldu." };

    } catch (error) {
        console.error("Error completing stage:", error);
        return { success: false, message: "İşlem başarısız oldu." };
    }
}
