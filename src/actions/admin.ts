"use server";

import { revalidatePath } from "next/cache";
import { db as prisma } from "@/core/database/client";
import { StageStatus } from "@prisma/client";


// ============================================
// STAGE ACTIONS
// ============================================

// ============================================
// STAGE ACTIONS
// ============================================

export async function moveStageUp(id: number) {
    try {
        const stage = await prisma.stage.findUnique({ where: { id } });
        if (!stage) throw new Error("Aşama bulunamadı");

        const prevStage = await prisma.stage.findFirst({
            where: { sequenceOrder: { lt: stage.sequenceOrder } },
            orderBy: { sequenceOrder: 'desc' }
        });

        if (!prevStage) return { success: false, error: "Zaten en üstte" };

        const tempOrder = stage.sequenceOrder;
        await prisma.$transaction([
            prisma.stage.update({ where: { id }, data: { sequenceOrder: prevStage.sequenceOrder } }),
            prisma.stage.update({ where: { id: prevStage.id }, data: { sequenceOrder: tempOrder } })
        ]);

        revalidatePath("/admin/timeline");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Taşıma başarısız" };
    }
}

export async function moveStageDown(id: number) {
    try {
        const stage = await prisma.stage.findUnique({ where: { id } });
        if (!stage) throw new Error("Aşama bulunamadı");

        const nextStage = await prisma.stage.findFirst({
            where: { sequenceOrder: { gt: stage.sequenceOrder } },
            orderBy: { sequenceOrder: 'asc' }
        });

        if (!nextStage) return { success: false, error: "Zaten en altta" };

        const tempOrder = stage.sequenceOrder;
        await prisma.$transaction([
            prisma.stage.update({ where: { id }, data: { sequenceOrder: nextStage.sequenceOrder } }),
            prisma.stage.update({ where: { id: nextStage.id }, data: { sequenceOrder: tempOrder } })
        ]);

        revalidatePath("/admin/timeline");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Taşıma başarısız" };
    }
}

export async function createStage(data: {
    title: string;
    slug: string;
    description: string;
    iconKey: string;
    sequenceOrder: number;
    variant?: string;
    status?: StageStatus;
}) {
    try {
        const targetStatus = data.status || StageStatus.LOCKED;
        const targetOrder = data.sequenceOrder;

        if (targetStatus === StageStatus.ACTIVE) {
            // Transaction for new active stage
            await prisma.$transaction([
                prisma.stage.updateMany({
                    where: { sequenceOrder: { lt: targetOrder } },
                    data: { status: StageStatus.COMPLETED }
                }),
                prisma.stage.updateMany({
                    where: { sequenceOrder: { gt: targetOrder } },
                    data: { status: StageStatus.LOCKED }
                }),
                prisma.stage.create({
                    data: {
                        title: data.title,
                        slug: data.slug,
                        description: data.description,
                        iconKey: data.iconKey,
                        status: targetStatus,
                        sequenceOrder: targetOrder,
                        isVisible: true,
                        variant: data.variant || "default",
                    },
                })
            ]);
        } else {
            await prisma.stage.create({
                data: {
                    title: data.title,
                    slug: data.slug,
                    description: data.description,
                    iconKey: data.iconKey,
                    status: targetStatus,
                    sequenceOrder: targetOrder,
                    isVisible: true,
                    variant: data.variant || "default",
                },
            });
        }

        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath("/admin/timeline");

        return { success: true };
    } catch (error) {
        console.error("Error creating stage:", error);
        return { success: false, error: "Aşama oluşturulamadı" };
    }
}

export async function updateStage(
    id: number,
    data: {
        title?: string;
        description?: string;
        iconKey?: string;
        status?: StageStatus;
        sequenceOrder?: number;
        isVisible?: boolean;
        variant?: string;
    }
) {
    try {
        // If status is being set to ACTIVE, we need to handle other stages
        if (data.status === StageStatus.ACTIVE) {
            const stageToUpdate = await prisma.stage.findUnique({ where: { id } });
            if (!stageToUpdate) throw new Error("Aşama bulunamadı");

            const targetOrder = data.sequenceOrder ?? stageToUpdate.sequenceOrder;

            await prisma.$transaction([
                prisma.stage.updateMany({
                    where: { sequenceOrder: { lt: targetOrder } },
                    data: { status: StageStatus.COMPLETED }
                }),
                prisma.stage.updateMany({
                    where: { sequenceOrder: { gt: targetOrder } },
                    data: { status: StageStatus.LOCKED }
                }),
                prisma.stage.update({
                    where: { id },
                    data
                })
            ]);
        } else if (data.status === StageStatus.COMPLETED) {
            // Find the current stage and its order
            const currentStage = await prisma.stage.findUnique({ where: { id } });
            if (!currentStage) throw new Error("Aşama bulunamadı");

            const currentOrder = data.sequenceOrder ?? currentStage.sequenceOrder;

            // Find the next stage
            const nextStage = await prisma.stage.findFirst({
                where: { sequenceOrder: { gt: currentOrder } },
                orderBy: { sequenceOrder: 'asc' }
            });

            if (nextStage) {
                // Progress to next stage: Set others < next.order to COMPLETED, next to ACTIVE, others > next to LOCKED
                const nextOrder = nextStage.sequenceOrder;
                await prisma.$transaction([
                    prisma.stage.updateMany({
                        where: { sequenceOrder: { lt: nextOrder } },
                        data: { status: StageStatus.COMPLETED }
                    }),
                    prisma.stage.update({
                        where: { id: nextStage.id },
                        data: { status: StageStatus.ACTIVE }
                    }),
                    prisma.stage.updateMany({
                        where: { sequenceOrder: { gt: nextOrder } },
                        data: { status: StageStatus.LOCKED }
                    }),
                    // Ensure the current one is also updated with any other data provided
                    prisma.stage.update({
                        where: { id },
                        data
                    })
                ]);
            } else {
                // No next stage found, just mark current as completed
                await prisma.stage.update({
                    where: { id },
                    data
                });
            }
        } else {
            // Normal individual update
            await prisma.stage.update({
                where: { id },
                data,
            });
        }

        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath("/admin/timeline");

        return { success: true };
    } catch (error) {
        console.error("Error updating stage:", error);
        return { success: false, error: "Aşama güncellenemedi" };
    }
}

export async function updateStageContent(id: number, content: any) {
    try {
        console.log("updateStageContent [START]", { id });
        const result = await prisma.stage.update({
            where: { id },
            data: { content: JSON.stringify(content) },
        });
        console.log("updateStageContent [SUCCESS]");

        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath("/admin/timeline");

        // Revalidate specific stage page if needed
        const stage = await prisma.stage.findUnique({ where: { id }, select: { slug: true } });
        if (stage?.slug) {
            revalidatePath(`/asamalar/${stage.slug}`);
        }

        return { success: true };
    } catch (error: any) {
        console.error("updateStageContent [ERROR]", error);
        return {
            success: false,
            error: `Sayfa içeriği kaydedilemedi: ${error?.message || "Bilinmeyen hata"}`
        };
    }
}

export async function deleteStage(id: number) {
    try {
        // Delete related posts first (manual cascade)
        await prisma.post.deleteMany({
            where: { stageId: id },
        });

        await prisma.stage.delete({
            where: { id },
        });

        revalidatePath("/");
        revalidatePath("/admin");

        return { success: true };
    } catch (error) {
        console.error("Error deleting stage:", error);
        return { success: false, error: "Aşama silinemedi" };
    }
}

// ============================================
// EVENT ACTIONS (Meetings/Announcements)
// ============================================

export async function createEvent(data: {
    stageId: number;
    title: string;
    eventDate: Date;
    description?: string;
}) {
    try {
        // We use Post model with type MEETING for events
        const event = await prisma.post.create({
            data: {
                stageId: data.stageId,
                title: data.title,
                eventDate: data.eventDate,
                content: data.description ? JSON.stringify({ blocks: [{ type: "paragraph", data: { text: data.description } }] }) : undefined,
                type: "MEETING",
                isPublished: true,
            },
        });

        revalidatePath("/");
        revalidatePath("/admin");

        return { success: true, event };
    } catch (error) {
        console.error("Error creating event:", error);
        return { success: false, error: "Etkinlik oluşturulamadı" };
    }
}

export async function updateEvent(
    id: string, // Changed from number to string (UUID)
    data: {
        title?: string;
        eventDate?: Date;
        description?: string;
    }
) {
    try {
        const event = await prisma.post.update({
            where: { id },
            data: {
                title: data.title,
                eventDate: data.eventDate,
                content: data.description ? JSON.stringify({ blocks: [{ type: "paragraph", data: { text: data.description } }] }) : undefined,
            },
        });

        revalidatePath("/");
        revalidatePath("/admin");

        return { success: true, event };
    } catch (error) {
        console.error("Error updating event:", error);
        return { success: false, error: "Etkinlik güncellenemedi" };
    }
}

export async function deleteEvent(id: string) { // Changed from number to string (UUID)
    try {
        await prisma.post.delete({
            where: { id },
        });

        revalidatePath("/");
        revalidatePath("/admin");

        return { success: true };
    } catch (error) {
        console.error("Error deleting event:", error);
        return { success: false, error: "Etkinlik silinemedi" };
    }
}

// ============================================
// POST ACTIONS (Announcements)
// ============================================

export async function createPost(data: {
    stageId: number;
    title: string;
    content: string;
    type?: "ANNOUNCEMENT" | "MEETING" | "SURVEY";
    imageUrl?: string;
    attachmentUrl?: string;
}) {
    try {
        const post = await prisma.post.create({
            data: {
                stageId: data.stageId,
                title: data.title,
                content: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: data.content } }] }),
                type: data.type || "ANNOUNCEMENT",
                imageUrl: data.imageUrl || null,
                attachmentUrl: data.attachmentUrl || null,
            },
        });

        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath(`/asamalar/${post.stageId}`);

        return { success: true, post };
    } catch (error) {
        console.error("Error creating post:", error);
        return { success: false, error: error instanceof Error ? error.message : "Duyuru oluşturulamadı" };
    }
}

export async function updatePost(
    id: number,
    data: {
        title?: string;
        content?: string;
        imageUrl?: string;
        attachmentUrl?: string;
    }
) {
    try {
        const post = await prisma.post.update({
            where: { id },
            data,
        });

        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath(`/asamalar/${post.stageId}`);

        return { success: true, post };
    } catch (error) {
        console.error("Error updating post:", error);
        return { success: false, error: "Duyuru güncellenemedi" };
    }
}

export async function deletePost(id: number) {
    try {
        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return { success: false, error: "Duyuru bulunamadı" };
        }

        await prisma.post.delete({
            where: { id },
        });

        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath(`/asamalar/${post.stageId}`);

        return { success: true };
    } catch (error) {
        console.error("Error deleting post:", error);
        return { success: false, error: "Duyuru silinemedi" };
    }
}

// ============================================
// UTILITY ACTIONS
// ============================================

export async function getAllStages() {
    try {
        const stages = await prisma.stage.findMany({
            orderBy: { sequenceOrder: "asc" },
            include: {
                posts: {
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        return { success: true, stages };
    } catch (error) {
        console.error("Error fetching stages:", error);
        return { success: false, error: "Aşamalar yüklenemedi", stages: [] };
    }
}
