"use server";

import { db } from "@/lib/db";
import { ActionType } from "@prisma/client";

/**
 * Track an analytics event
 */
export async function trackAnalytics({
    action,
    targetId,
    userId,
    ipAddress,
}: {
    action: ActionType;
    targetId?: string;
    userId?: string;
    ipAddress?: string;
}) {
    try {
        await db.analyticsLog.create({
            data: {
                action,
                targetId,
                userId,
                ipAddress,
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to track analytics:", error);
        return { success: false, error };
    }
}

/**
 * Get total page views
 */
export async function getPageViewCount() {
    try {
        const count = await db.analyticsLog.count({
            where: {
                action: ActionType.PAGE_VIEW,
            },
        });
        return count;
    } catch (error) {
        console.error("Failed to get page view count:", error);
        return 0;
    }
}

/**
 * Get total shares
 */
export async function getShareCount() {
    try {
        const count = await db.analyticsLog.count({
            where: {
                action: ActionType.SHARE,
            },
        });
        return count;
    } catch (error) {
        console.error("Failed to get share count:", error);
        return 0;
    }
}

/**
 * Get total survey votes
 */
export async function getSurveyVoteCount() {
    try {
        const count = await db.surveyVote.count();
        return count;
    } catch (error) {
        console.error("Failed to get survey vote count:", error);
        return 0;
    }
}

/**
 * Get total registered users (Malik count)
 */
export async function getTotalMalikCount() {
    try {
        const count = await db.user.count();
        return count;
    } catch (error) {
        console.error("Failed to get malik count:", error);
        return 0;
    }
}

/**
 * Get most viewed pages
 */
export async function getMostViewedPages(limit = 5) {
    try {
        const pageViews = await db.analyticsLog.groupBy({
            by: ["targetId"],
            where: {
                action: ActionType.PAGE_VIEW,
                targetId: { not: null },
            },
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: "desc",
                },
            },
            take: limit,
        });

        return pageViews.map((pv) => ({
            pageId: pv.targetId,
            viewCount: pv._count.id,
        }));
    } catch (error) {
        console.error("Failed to get most viewed pages:", error);
        return [];
    }
}

/**
 * Get analytics summary for dashboard
 */
export async function getAnalyticsSummary() {
    try {
        const [pageViews, shares, surveyVotes, malikCount] = await Promise.all([
            getPageViewCount(),
            getShareCount(),
            getSurveyVoteCount(),
            getTotalMalikCount(),
        ]);

        return {
            pageViews,
            shares,
            surveyVotes,
            malikCount,
        };
    } catch (error) {
        console.error("Failed to get analytics summary:", error);
        return {
            pageViews: 0,
            shares: 0,
            surveyVotes: 0,
            malikCount: 0,
        };
    }
}
