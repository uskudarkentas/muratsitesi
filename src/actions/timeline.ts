"use server";

import { db } from "@/core/database/client";
import { STAGES } from "@/lib/stages";

// 1. Fetch the latest published Post for a given stage (Home - Content Panel)
export async function getLatestStagePost(stageId: number) {
    try {
        const post = await db.post.findFirst({
            where: {
                stageId: stageId,
                isPublished: true,
            },
            orderBy: {
                publishedAt: "desc",
            },
            include: {
                stage: true, // Include stage info if needed
            },
        });
        return post;
    } catch (error) {
        console.error(`Error fetching latest post for stage ${stageId}:`, error);
        return null;
    }
}

// 2. Fetch "Next Project-Wide Event" (Future Meetings/Surveys) for Project Summary
export async function getFutureEvents() {
    try {
        const event = await db.post.findFirst({
            where: {
                isPublished: true,
                type: {
                    in: ["MEETING", "SURVEY"],
                },
                eventDate: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)), // Include today until midnight
                },
            },
            orderBy: {
                eventDate: "asc", // Closest event first
            },
            include: {
                stage: true, // Include stage info for context
            },
        });
        return event;
    } catch (error) {
        console.error(`Error fetching project-wide future events:`, error);
        return null;
    }
}

// 3. Fetch all posts for a stage (Detail Page)
export async function getStagePosts(slug: string) {
    try {
        const stage = STAGES.find((s) => s.slug === slug);
        if (!stage) return [];

        const posts = await db.post.findMany({
            where: {
                stageId: stage.id,
                isPublished: true,
            },
            orderBy: {
                publishedAt: "desc",
            },
        });
        return posts;
    } catch (error) {
        console.error(`Error fetching posts for slug ${slug}:`, error);
        return [];
    }
}
