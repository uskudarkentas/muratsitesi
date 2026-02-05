"use server";

import { revalidatePath } from "next/cache";
import { postService } from "@/features/posts/services/postService";
import { PostType } from "@/entities/post/model";

/**
 * Server Actions for Post Management
 * 
 * Thin wrappers around PostService.
 * Handle Next.js-specific concerns (revalidation, serialization).
 */

/**
 * Get posts by stage
 */
export async function getPostsByStage(stageId: number) {
    try {
        const posts = await postService.getPostsByStage(stageId);
        return {
            success: true,
            data: posts.map(p => p.toJSON()),
        };
    } catch (error: any) {
        console.error("Error getting posts:", error);
        return {
            success: false,
            error: error.message || "Failed to get posts",
        };
    }
}

/**
 * Get published posts by stage
 */
export async function getPublishedPostsByStage(stageId: number) {
    try {
        const posts = await postService.getPublishedPostsByStage(stageId);
        return {
            success: true,
            data: posts.map(p => p.toJSON()),
        };
    } catch (error: any) {
        console.error("Error getting published posts:", error);
        return {
            success: false,
            error: error.message || "Failed to get published posts",
        };
    }
}

/**
 * Get latest post for a stage
 */
export async function getLatestPost(stageId: number) {
    try {
        const post = await postService.getLatestPost(stageId);
        return {
            success: true,
            data: post ? post.toJSON() : null,
        };
    } catch (error: any) {
        console.error("Error getting latest post:", error);
        return {
            success: false,
            error: error.message || "Failed to get latest post",
        };
    }
}

/**
 * Create a new post
 */
export async function createPost(data: {
    stageId: number;
    type: PostType;
    title: string;
    content?: string;
    imageUrl?: string;
    attachmentUrl?: string;
    eventDate?: Date;
    isPublished?: boolean;
}) {
    try {
        const post = await postService.createPost(data);

        revalidatePath("/");
        revalidatePath("/admin");

        return {
            success: true,
            data: post.toJSON(),
        };
    } catch (error: any) {
        console.error("Error creating post:", error);
        return {
            success: false,
            error: error.message || "Failed to create post",
        };
    }
}

/**
 * Update a post
 */
export async function updatePost(
    id: string,
    data: {
        title?: string;
        content?: string;
        imageUrl?: string;
        attachmentUrl?: string;
        eventDate?: Date;
        isPublished?: boolean;
    }
) {
    try {
        const post = await postService.updatePost(id, data);

        revalidatePath("/");
        revalidatePath("/admin");

        return {
            success: true,
            data: post.toJSON(),
        };
    } catch (error: any) {
        console.error("Error updating post:", error);
        return {
            success: false,
            error: error.message || "Failed to update post",
        };
    }
}

/**
 * Publish a post
 */
export async function publishPost(id: string) {
    try {
        const post = await postService.publishPost(id);

        revalidatePath("/");
        revalidatePath("/admin");

        return {
            success: true,
            data: post.toJSON(),
        };
    } catch (error: any) {
        console.error("Error publishing post:", error);
        return {
            success: false,
            error: error.message || "Failed to publish post",
        };
    }
}

/**
 * Unpublish a post
 */
export async function unpublishPost(id: string) {
    try {
        const post = await postService.unpublishPost(id);

        revalidatePath("/");
        revalidatePath("/admin");

        return {
            success: true,
            data: post.toJSON(),
        };
    } catch (error: any) {
        console.error("Error unpublishing post:", error);
        return {
            success: false,
            error: error.message || "Failed to unpublish post",
        };
    }
}

/**
 * Delete a post
 */
export async function deletePost(id: string) {
    try {
        await postService.deletePost(id);

        revalidatePath("/");
        revalidatePath("/admin");

        return { success: true };
    } catch (error: any) {
        console.error("Error deleting post:", error);
        return {
            success: false,
            error: error.message || "Failed to delete post",
        };
    }
}

/**
 * Get upcoming events
 */
export async function getUpcomingEvents() {
    try {
        const events = await postService.getUpcomingEvents();
        return {
            success: true,
            data: events.map(e => e.toJSON()),
        };
    } catch (error: any) {
        console.error("Error getting upcoming events:", error);
        return {
            success: false,
            error: error.message || "Failed to get upcoming events",
        };
    }
}

/**
 * Get active surveys
 */
export async function getActiveSurveys() {
    try {
        const surveys = await postService.getActiveSurveys();
        return {
            success: true,
            data: surveys.map(s => s.toJSON()),
        };
    } catch (error: any) {
        console.error("Error getting active surveys:", error);
        return {
            success: false,
            error: error.message || "Failed to get active surveys",
        };
    }
}
