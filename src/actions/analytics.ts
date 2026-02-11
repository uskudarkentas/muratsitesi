"use server";

import { db } from "@/core/database/client";
import { ActionType } from "@/shared/types/analytics";

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
    // TEMPORARY FIX: Disable analytics tracking during debug/build issues
    // We can re-enable this later when we fix the build-time DB access issue
    return { success: true };
}

/**
 * Get total page views
 */
export async function getPageViewCount() {
    return 0;
}

/**
 * Get total shares
 */
export async function getShareCount() {
    return 0;
}

/**
 * Get total survey votes
 */
export async function getSurveyVoteCount() {
    return 0;
}

/**
 * Get total registered users (Malik count)
 */
export async function getTotalMalikCount() {
    return 0;
}

/**
 * Get most viewed pages
 */
export async function getMostViewedPages(limit = 5) {
    return [];
}

/**
 * Get analytics summary for dashboard
 */
export async function getAnalyticsSummary() {
    return {
        pageViews: 0,
        shares: 0,
        surveyVotes: 0,
        malikCount: 0,
    };
}
