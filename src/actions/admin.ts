"use server";

import { revalidatePath } from "next/cache";
import { db as prisma } from "@/lib/db";
import { StageStatus } from "@prisma/client";


// ============================================
// STAGE ACTIONS
// ============================================

// ============================================
// STAGE ACTIONS
// ============================================

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
        const stage = await prisma.stage.create({
            data: {
                title: data.title,
                slug: data.slug,
                description: data.description,
                iconKey: data.iconKey,
                status: data.status || StageStatus.LOCKED,
                sequenceOrder: data.sequenceOrder,
                isVisible: true,
                variant: data.variant || "default",
            },
        });

        revalidatePath("/");
        revalidatePath("/admin");

        return { success: true, stage };
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
        const stage = await prisma.stage.update({
            where: { id },
            data,
        });

        revalidatePath("/");
        revalidatePath("/admin");

        return { success: true, stage };
    } catch (error) {
        console.error("Error updating stage:", error);
        return { success: false, error: "Aşama güncellenemedi" };
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
    imageUrl?: string;
    attachmentUrl?: string;
}) {
    try {
        const post = await prisma.post.create({
            data: {
                stageId: data.stageId,
                title: data.title,
                content: data.content,
                imageUrl: data.imageUrl,
                attachmentUrl: data.attachmentUrl,
            },
        });

        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath(`/asamalar/${post.stageId}`);

        return { success: true, post };
    } catch (error) {
        console.error("Error creating post:", error);
        return { success: false, error: "Duyuru oluşturulamadı" };
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
        });

        return { success: true, stages };
    } catch (error) {
        console.error("Error fetching stages:", error);
        return { success: false, error: "Aşamalar yüklenemedi", stages: [] };
    }
}
