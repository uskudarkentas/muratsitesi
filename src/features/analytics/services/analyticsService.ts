import { analyticsRepository } from "../repositories/analyticsRepository";
import { startOfDay, endOfDay, subDays, format } from "date-fns";
import { tr } from "date-fns/locale";

interface DailyEngagement {
    date: string;
    fullDate: string;
    engagement: number;
    views: number;
    clicks: number;
    actions: number;
    activeUsers: number;
}

export class AnalyticsService {
    /**
     * Get daily engagement metrics for the last N days
     */
    async getDailyEngagement(days: number = 30): Promise<DailyEngagement[]> {
        const endDate = endOfDay(new Date());
        const startDate = startOfDay(subDays(new Date(), days - 1));

        // Fetch all logs in range
        const logs = await analyticsRepository.findByDateRange(startDate, endDate);

        // Process day by day
        const result: DailyEngagement[] = [];

        for (let i = days - 1; i >= 0; i--) {
            const currentDay = subDays(new Date(), i);
            const dayStart = startOfDay(currentDay);
            const dayEnd = endOfDay(currentDay);

            // Filter logs for this day
            const dayLogs = logs.filter(l =>
                l.timestamp >= dayStart && l.timestamp <= dayEnd
            );

            // Calculate metrics
            let score = 0;
            let views = 0;
            let clicks = 0;
            let actions = 0;
            const uniqueUsers = new Set<string>();

            for (const log of dayLogs) {
                if (log.userId) uniqueUsers.add(log.userId);

                // Determine points based on actionType or fallback to action parsing
                // Assuming actionType is populated going forward.
                // Fallback logic for legacy data or if actionType is missing:
                const type = log.actionType || this.inferActionType(log.action);

                if (type === 'VIEW') {
                    score += 1;
                    views++;
                } else if (type === 'CLICK') {
                    score += 5;
                    clicks++;
                } else if (type === 'ACTION') {
                    score += 10;
                    actions++;
                }
            }

            const activeUsers = uniqueUsers.size || 1; // Avoid division by zero, though for index it's numerator

            // Engagement Index Calculation
            // "Normalize: Convert the total into a 0-100 scale (Index) based on the number of active users"
            // Formula: (Total Score / Active Users) * Scaling Factor
            // Let's assume a "Hero User" gets 20 points a day. So 20 points/user = 100 Index.
            // Scaling Factor = 5.
            // Index = (TotalScore / ActiveUsers) * 5

            const averageScorePerUser = uniqueUsers.size > 0 ? (score / uniqueUsers.size) : 0;
            const engagementIndex = Math.min(100, Math.round(averageScorePerUser * 5));

            result.push({
                date: format(currentDay, "MMM dd", { locale: tr }),
                fullDate: format(currentDay, "d MMMM yyyy", { locale: tr }),
                engagement: engagementIndex,
                views,
                clicks,
                actions,
                activeUsers: uniqueUsers.size
            });
        }

        return result;
    }

    private inferActionType(action: string): string {
        const upper = action.toUpperCase();
        if (upper.includes('VIEW')) return 'VIEW';
        if (upper.includes('CLICK') || upper.includes('OPEN') || upper.includes('EXPAND')) return 'CLICK';
        if (upper.includes('CREATE') || upper.includes('UPDATE') || upper.includes('DELETE') || upper.includes('VOTE') || upper.includes('JOIN') || upper.includes('DOWNLOAD')) return 'ACTION';
        return 'VIEW'; // Default to lowest weight
    }
}

export const analyticsService = new AnalyticsService();
