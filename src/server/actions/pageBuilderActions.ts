"use server";

import { revalidatePath } from "next/cache";
import { pageBuilderService } from "@/features/page-builder/services/pageBuilderService";

/**
 * Server Actions for Page Builder
 * 
 * Thin wrappers around PageBuilderService.
 * Handle Next.js-specific concerns (revalidation, serialization).
 */

/**
 * Get page content by slug
 */
export async function getPageContent(slug: string) {
    try {
        const content = await pageBuilderService.getPageContentOrNull(slug);
        return {
            success: true,
            data: content ? content.toJSON() : null,
        };
    } catch (error: any) {
        console.error("Error getting page content:", error);
        return {
            success: false,
            error: error.message || "Failed to get page content",
        };
    }
}

/**
 * Save page content
 */
export async function savePageContent(slug: string, blocks: any[]) {
    try {
        const content = await pageBuilderService.savePageContent(slug, blocks);

        revalidatePath(`/asamalar/${slug}`);
        revalidatePath("/admin/page-builder");

        return {
            success: true,
            data: content.toJSON(),
        };
    } catch (error: any) {
        console.error("Error saving page content:", error);
        return {
            success: false,
            error: error.message || "Failed to save page content",
        };
    }
}

/**
 * Get all templates
 */
export async function getTemplates() {
    try {
        const templates = await pageBuilderService.getTemplates();
        return {
            success: true,
            data: templates.map(t => t.toJSON()),
        };
    } catch (error: any) {
        console.error("Error getting templates:", error);
        return {
            success: false,
            error: error.message || "Failed to get templates",
        };
    }
}

/**
 * Get all pages
 */
export async function getPages() {
    try {
        const pages = await pageBuilderService.getPages();
        return {
            success: true,
            data: pages.map(p => p.toJSON()),
        };
    } catch (error: any) {
        console.error("Error getting pages:", error);
        return {
            success: false,
            error: error.message || "Failed to get pages",
        };
    }
}

/**
 * Delete page content
 */
export async function deletePageContent(slug: string) {
    try {
        await pageBuilderService.deletePageContent(slug);

        revalidatePath(`/asamalar/${slug}`);
        revalidatePath("/admin/page-builder");

        return { success: true };
    } catch (error: any) {
        console.error("Error deleting page content:", error);
        return {
            success: false,
            error: error.message || "Failed to delete page content",
        };
    }
}

/**
 * Duplicate a page
 */
export async function duplicatePage(sourceSlug: string, targetSlug: string) {
    try {
        const content = await pageBuilderService.duplicatePage(sourceSlug, targetSlug);

        revalidatePath("/admin/page-builder");

        return {
            success: true,
            data: content.toJSON(),
        };
    } catch (error: any) {
        console.error("Error duplicating page:", error);
        return {
            success: false,
            error: error.message || "Failed to duplicate page",
        };
    }
}
