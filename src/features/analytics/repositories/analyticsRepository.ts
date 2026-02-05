import { db } from '@/core/database/client';
import { AnalyticsLogCreateInput, AnalyticsLogWhereInput } from '@/core/database/types';
import { DatabaseError } from '@/core/errors/AppError';

/**
 * Analytics Log Entry
 */
export interface AnalyticsLog {
    id: string;
    userId: string | null;
    action: string;
    targetId: string | null;
    ipAddress: string | null;
    timestamp: Date;
}

/**
 * Analytics Repository
 * 
 * Handles all database operations for analytics logs.
 * Simpler than other repositories as it's mostly write-heavy.
 */
export class AnalyticsRepository {
    /**
     * Log an action
     */
    async log(data: {
        userId?: string;
        action: string;
        targetId?: string;
        ipAddress?: string;
    }): Promise<AnalyticsLog> {
        try {
            const log = await db.analyticsLog.create({
                data: {
                    userId: data.userId || null,
                    action: data.action,
                    targetId: data.targetId || null,
                    ipAddress: data.ipAddress || null,
                },
            });
            return this.toDomain(log);
        } catch (error) {
            throw new DatabaseError('Failed to create analytics log', error as Error);
        }
    }

    /**
     * Get logs by user ID
     */
    async findByUserId(userId: string, limit: number = 100): Promise<AnalyticsLog[]> {
        try {
            const logs = await db.analyticsLog.findMany({
                where: { userId },
                orderBy: { timestamp: 'desc' },
                take: limit,
            });
            return logs.map(l => this.toDomain(l));
        } catch (error) {
            throw new DatabaseError('Failed to find logs by user', error as Error);
        }
    }

    /**
     * Get logs by action type
     */
    async findByAction(action: string, limit: number = 100): Promise<AnalyticsLog[]> {
        try {
            const logs = await db.analyticsLog.findMany({
                where: { action },
                orderBy: { timestamp: 'desc' },
                take: limit,
            });
            return logs.map(l => this.toDomain(l));
        } catch (error) {
            throw new DatabaseError('Failed to find logs by action', error as Error);
        }
    }

    /**
     * Get logs for a specific target
     */
    async findByTargetId(targetId: string, limit: number = 100): Promise<AnalyticsLog[]> {
        try {
            const logs = await db.analyticsLog.findMany({
                where: { targetId },
                orderBy: { timestamp: 'desc' },
                take: limit,
            });
            return logs.map(l => this.toDomain(l));
        } catch (error) {
            throw new DatabaseError('Failed to find logs by target', error as Error);
        }
    }

    /**
     * Get recent logs
     */
    async findRecent(limit: number = 100): Promise<AnalyticsLog[]> {
        try {
            const logs = await db.analyticsLog.findMany({
                orderBy: { timestamp: 'desc' },
                take: limit,
            });
            return logs.map(l => this.toDomain(l));
        } catch (error) {
            throw new DatabaseError('Failed to find recent logs', error as Error);
        }
    }

    /**
     * Count logs by action
     */
    async countByAction(action: string): Promise<number> {
        try {
            return await db.analyticsLog.count({
                where: { action },
            });
        } catch (error) {
            throw new DatabaseError('Failed to count logs by action', error as Error);
        }
    }

    /**
     * Count unique users who performed an action
     */
    async countUniqueUsers(action?: string): Promise<number> {
        try {
            const result = await db.analyticsLog.groupBy({
                by: ['userId'],
                where: action ? { action } : undefined,
                _count: true,
            });
            return result.filter(r => r.userId !== null).length;
        } catch (error) {
            throw new DatabaseError('Failed to count unique users', error as Error);
        }
    }

    /**
     * Get logs within date range
     */
    async findByDateRange(startDate: Date, endDate: Date): Promise<AnalyticsLog[]> {
        try {
            const logs = await db.analyticsLog.findMany({
                where: {
                    timestamp: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                orderBy: { timestamp: 'desc' },
            });
            return logs.map(l => this.toDomain(l));
        } catch (error) {
            throw new DatabaseError('Failed to find logs by date range', error as Error);
        }
    }

    /**
     * Delete old logs (cleanup)
     */
    async deleteOlderThan(date: Date): Promise<number> {
        try {
            const result = await db.analyticsLog.deleteMany({
                where: {
                    timestamp: { lt: date },
                },
            });
            return result.count;
        } catch (error) {
            throw new DatabaseError('Failed to delete old logs', error as Error);
        }
    }

    /**
     * Convert Prisma log to domain model
     */
    private toDomain(prismaLog: any): AnalyticsLog {
        return {
            id: prismaLog.id,
            userId: prismaLog.userId,
            action: prismaLog.action,
            targetId: prismaLog.targetId,
            ipAddress: prismaLog.ipAddress,
            timestamp: prismaLog.timestamp,
        };
    }
}

// Export singleton instance
export const analyticsRepository = new AnalyticsRepository();
