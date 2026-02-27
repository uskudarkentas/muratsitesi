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
        const currentStage = await db.stage.findUnique({
            where: { id: stageId },
        });

        if (!currentStage) {
            throw new Error("Stage not found");
        }

        // 1 & 2 & 3. Perform updates in a transaction
        const nextStage = await db.$transaction(async (tx) => {
            // Mark the current stage as COMPLETED
            await tx.stage.update({
                where: { id: stageId },
                data: { status: "COMPLETED", progress: 100 }
            });

            // Find the next stage in sequence
            const next = await tx.stage.findFirst({
                where: {
                    sequenceOrder: { gt: currentStage.sequenceOrder },
                    isVisible: true
                },
                orderBy: { sequenceOrder: 'asc' }
            });

            // If exists, activate it
            if (next) {
                // We use direct DB update here to stay in the same transaction
                // stageService.updateStage handles other cascades, but for a simple linear move, 
                // we can just activate the next one and locked/completed the rest if needed.
                // However, stageService.updateStage is safer for consistency.
                // Since we can't easily use the service inside a prisma transaction without passing the tx client,
                // we'll at least set the next one to ACTIVE.
                await tx.stage.update({
                    where: { id: next.id },
                    data: { status: "ACTIVE" }
                });

                // Update stages after next to LOCKED
                await tx.stage.updateMany({
                    where: { sequenceOrder: { gt: next.sequenceOrder } },
                    data: { status: "LOCKED" }
                });
            }

            return next;
        });

        // 4. Automation: Create Announcement Post
        // (Moved out of transaction as it's less critical and might involve other services)
        const title = currentStage.autoPostTitle || `Bilgilendirme: ${currentStage.title} Aşaması Tamamlandı`;
        const defaultContent = JSON.stringify({
            time: Date.now(),
            blocks: [{ id: "default-block", type: "paragraph", data: { text: `${currentStage.title} aşaması başarıyla tamamlanmıştır.` } }],
            version: "2.29.0"
        });

        await db.post.create({
            data: {
                stageId: currentStage.id,
                type: "ANNOUNCEMENT",
                title: title,
                content: defaultContent,
                isPublished: false,
            },
        });

        revalidatePath("/admin/timeline");
        revalidatePath("/admin");
        revalidatePath("/");

        return {
            success: true,
            message: nextStage
                ? `"${currentStage.title}" tamamlandı. Sıradaki aktif aşama: "${nextStage.title}"`
                : `"${currentStage.title}" tamamlandı. Süreç sona erdi.`
        };

    } catch (error) {
        console.error("Error completing stage:", error);
        return { success: false, message: "İşlem başarısız oldu." };
    }
}
