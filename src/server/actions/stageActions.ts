"use server";

import { revalidatePath } from "next/cache";
import { stageService } from "@/features/stages/services/stageService";
import { StageStatus } from "@/entities/stage/model";

/**
 * Server Actions for Stage Management
 * 
 * Thin wrappers around StageService.
 * Handle Next.js-specific concerns (revalidation, serialization).
 */

/**
 * Get all stages
 */
export async function getStages() {
    try {
        const stages = await stageService.getAllStages();
        return {
            success: true,
            data: stages.map(s => s.toJSON()),
        };
    } catch (error: any) {
        console.error("Error getting stages:", error);
        return {
            success: false,
            error: error.message || "Failed to get stages",
        };
    }
}

/**
 * Get stage by ID
 */
export async function getStageById(id: number) {
    try {
        const stage = await stageService.getStageById(id);
        return {
            success: true,
            data: stage.toJSON(),
        };
    } catch (error: any) {
        console.error("Error getting stage:", error);
        return {
            success: false,
            error: error.message || "Failed to get stage",
        };
    }
}

/**
 * Create a new stage
 */
export async function createStage(data: {
    title: string;
    slug: string;
    description?: string;
    iconKey: string;
    variant?: string;
    sequenceOrder: number;
    status?: StageStatus;
    isVisible?: boolean;
}) {
    try {
        const stage = await stageService.createStage(data);

        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath("/admin/timeline");

        return {
            success: true,
            data: stage.toJSON(),
        };
    } catch (error: any) {
        console.error("Error creating stage:", error);
        return {
            success: false,
            error: error.message || "Failed to create stage",
        };
    }
}

/**
 * Update a stage
 */
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
        const stage = await stageService.updateStage(id, data);

        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath("/admin/timeline");

        return {
            success: true,
            data: stage.toJSON(),
        };
    } catch (error: any) {
        console.error("Error updating stage:", error);
        return {
            success: false,
            error: error.message || "Failed to update stage",
        };
    }
}

/**
 * Delete a stage
 */
export async function deleteStage(id: number) {
    try {
        await stageService.deleteStage(id);

        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath("/admin/timeline");

        return { success: true };
    } catch (error: any) {
        console.error("Error deleting stage:", error);
        return {
            success: false,
            error: error.message || "Failed to delete stage",
        };
    }
}

/**
 * Reorder stages
 */
export async function reorderStages(stageIds: number[]) {
    try {
        await stageService.reorderStages(stageIds);

        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath("/admin/timeline");

        return { success: true };
    } catch (error: any) {
        console.error("Error reordering stages:", error);
        return {
            success: false,
            error: error.message || "Failed to reorder stages",
        };
    }
}

/**
 * Toggle stage visibility
 */
export async function toggleStageVisibility(id: number) {
    try {
        const stage = await stageService.toggleVisibility(id);

        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath("/admin/timeline");

        return {
            success: true,
            data: stage.toJSON(),
        };
    } catch (error: any) {
        console.error("Error toggling visibility:", error);
        return {
            success: false,
            error: error.message || "Failed to toggle visibility",
        };
    }
}
