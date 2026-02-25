"use server";

import { db } from "@/core/database/client";
import { ActionType } from "@/shared/types/analytics";
import { analyticsService } from "@/features/analytics/services/analyticsService";
import { analyticsRepository } from "@/features/analytics/repositories/analyticsRepository";

/**
 * Get engagement index data for charts
 */
export async function getEngagementAnalytics(days: number = 30) {
    try {
        const data = await analyticsService.getDailyEngagement(days);
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching engagement analytics:", error);
        return { success: false, error: "Veriler yüklenemedi", data: [] };
    }
}

/**
 * Track an analytics event
 */
export async function trackAnalytics({
    action,
    actionType,
    targetId,
    userId,
    ipAddress,
}: {
    action: ActionType | string;
    actionType?: 'VIEW' | 'CLICK' | 'ACTION' | string;
    targetId?: string;
    userId?: string;
    ipAddress?: string;
}) {
    try {
        await analyticsRepository.log({
            userId: userId || undefined,
            action: String(action),
            actionType: actionType || undefined,
            targetId: targetId || undefined,
            ipAddress: ipAddress || undefined,
        });
        return { success: true };
    } catch (error) {
        console.error("Analytics tracking error:", error);
        return { success: false };
    }
}

/**
 * Get recent system activities for dashboard
 */
export async function getRecentSystemActivities(limit = 5) {
    try {
        const logs = await db.analyticsLog.findMany({
            where: {
                user: {
                    role: 'ADMIN'
                },
                action: {
                    in: ['CREATE_POST', 'UPDATE_STAGE', 'UPDATE_PAGE', 'PUBLISH_SURVEY', 'ADD_BLOCK']
                }
            },
            take: 5, // Strict limit
            orderBy: {
                timestamp: 'desc'
            },
            include: {
                user: true
            }
        });

        // Map logs to dashboard activity format
        return logs.map(log => {
            const date = new Date(log.timestamp);
            const now = new Date();
            const diffInMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

            let timeStr = "";
            if (diffInMins < 1) timeStr = "Şimdi";
            else if (diffInMins < 60) timeStr = `${diffInMins} dk önce`;
            else if (diffInMins < 1440) timeStr = `${Math.floor(diffInMins / 60)} saat önce`;
            else timeStr = `${Math.floor(diffInMins / 1440)} gün önce`;

            // Mapping action types to readable text and types
            let actionText = log.action;
            let type: any = "system";
            let status: any = "Başarılı";

            // STRICT MAPPING Implementation (Refined)
            if (log.action === 'CREATE_POST') {
                actionText = "Yeni İçerik Eklendi";
                type = "announcement";
                status = "Yayınlandı";
            } else if (log.action === 'UPDATE_STAGE') {
                actionText = "Süreç Güncellendi";
                type = "system";
                status = "Güncellendi";
            } else if (log.action === 'ADD_BLOCK') {
                actionText = "Sayfa Düzeni Değişti";
                type = "page";
                status = "Eklendi";
            } else if (log.action === 'UPDATE_PAGE') {
                actionText = "İçerik Sayfası Düzenlendi"; // Slight adjustment for grammar
                type = "page";
                status = "Düzenlendi";
            } else if (log.action === 'PUBLISH_SURVEY') {
                actionText = "Anket Başlatıldı";
                type = "survey";
                status = "Yayınlandı";
            }

            return {
                id: log.id,
                admin: {
                    name: log.user?.fullName || "Yönetici",
                    role: 'Yönetici',
                    initials: log.user?.fullName ? log.user.fullName.split(' ').map(n => n[0]).join('') : "YÖ",
                    color: 'bg-blue-100 text-blue-700'
                },
                action: actionText,
                target: log.targetId || "Sistem İşlemi",
                type: type,
                timestamp: timeStr,
                status: status
            };
        });
    } catch (error) {
        console.error("Error fetching activities:", error);
        return [];
    }
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
