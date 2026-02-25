"use server";

import { db as prisma } from "@/lib/db";

export interface DashboardStats {
    totalUsers: number;
    newUsersThisWeek: number;
    totalPageViews: number;
    pageViewsGrowth: number;
    surveyParticipationRate: number;
    totalShares: number;
    sharesGrowth: number;
    isFallback?: boolean; // To indicate if we are using dummy data
}

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        // 1. User Stats
        const totalUsers = await prisma.user.count();

        // If DB is empty, return fallback
        if (totalUsers === 0) {
            return {
                totalUsers: 1240,
                newUsersThisWeek: 12,
                totalPageViews: 45200,
                pageViewsGrowth: 8.5,
                surveyParticipationRate: 85,
                totalShares: 320,
                sharesGrowth: 2,
                isFallback: true
            };
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Try to get new users count, gracefully fail if schema not updated in running client
        let newUsersThisWeek = 0;
        try {
            // @ts-ignore - Ignore type error if client not generated yet
            newUsersThisWeek = await prisma.user.count({
                where: {
                    createdAt: {
                        gte: sevenDaysAgo
                    }
                }
            });
        } catch (e) {
            console.warn("Could not count new users (prisma generate needed?):", e);
        }

        // 2. Page Views (Analytics)
        const now = new Date();
        const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Count all logs
        const totalPageViews = await prisma.analyticsLog.count();

        const currentMonthViews = await prisma.analyticsLog.count({
            where: {
                timestamp: { gte: firstDayCurrentMonth }
            }
        });

        const lastMonthViews = await prisma.analyticsLog.count({
            where: {
                timestamp: {
                    gte: firstDayLastMonth,
                    lt: firstDayCurrentMonth
                }
            }
        });

        let pageViewsGrowth = 0;
        if (lastMonthViews > 0) {
            pageViewsGrowth = ((currentMonthViews - lastMonthViews) / lastMonthViews) * 100;
        } else if (currentMonthViews > 0) {
            pageViewsGrowth = 100;
        }

        // 3. Survey Participation (From AnalyticsLog: ANKET_VOTE)
        // Users who voted at least once / Total Users
        // Using raw grouping or other method because distinct count on relational field is tricky heavily filtered
        // Actually groupBy is fine
        const voters = await prisma.analyticsLog.groupBy({
            by: ['userId'],
            where: {
                action: 'ANKET_VOTE',
                userId: { not: null }
            }
        });
        const uniqueVotersCount = voters.length;

        let surveyParticipationRate = 0;
        if (totalUsers > 0) {
            surveyParticipationRate = Math.round((uniqueVotersCount / totalUsers) * 100);
        }

        // 4. Shares (From AnalyticsLog: SOCIAL_SHARE)
        // Total shares
        const totalShares = await prisma.analyticsLog.count({
            where: {
                action: 'SOCIAL_SHARE'
            }
        });

        // Weekly growth for shares
        const currentWeekShares = await prisma.analyticsLog.count({
            where: {
                action: 'SOCIAL_SHARE',
                timestamp: { gte: sevenDaysAgo }
            }
        });

        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        const lastWeekShares = await prisma.analyticsLog.count({
            where: {
                action: 'SOCIAL_SHARE',
                timestamp: {
                    gte: fourteenDaysAgo,
                    lt: sevenDaysAgo
                }
            }
        });

        let sharesGrowth = 0;
        if (lastWeekShares > 0) {
            sharesGrowth = ((currentWeekShares - lastWeekShares) / lastWeekShares) * 100;
        } else if (currentWeekShares > 0) {
            sharesGrowth = 100;
        }

        return {
            totalUsers,
            newUsersThisWeek,
            totalPageViews,
            pageViewsGrowth: Number(pageViewsGrowth.toFixed(1)),
            surveyParticipationRate,
            totalShares,
            sharesGrowth: Number(sharesGrowth.toFixed(1)),
            isFallback: false
        };

    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // Fallback on error
        return {
            totalUsers: 1240,
            newUsersThisWeek: 12,
            totalPageViews: 45200,
            pageViewsGrowth: 8.5,
            surveyParticipationRate: 85,
            totalShares: 320,
            sharesGrowth: 2,
            isFallback: true
        };
    }
}
