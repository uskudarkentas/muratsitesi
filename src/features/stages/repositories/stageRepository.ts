import { BaseRepository } from '@/core/repositories/base.repository';
import { db } from '@/core/database/client';
import { Stage, StageStatus } from '@/entities/stage/model';
import {
    StageWhereInput,
    StageCreateInput,
    StageUpdateInput,
    StageOrderByInput,
} from '@/core/database/types';
import { DatabaseError } from '@/core/errors/AppError';

/**
 * Stage Repository
 * 
 * Handles all database operations for stages.
 * Converts between Prisma models and domain models.
 */
export class StageRepository extends BaseRepository<
    Stage,
    StageCreateInput,
    StageUpdateInput,
    StageWhereInput
> {
    protected get model() {
        return db.stage;
    }

    /**
     * Convert Prisma stage to domain model
     */
    protected toDomain(prismaStage: any): Stage {
        return new Stage(
            prismaStage.id,
            prismaStage.title,
            prismaStage.slug,
            prismaStage.description,
            prismaStage.status as StageStatus,
            prismaStage.sequenceOrder,
            prismaStage.isVisible,
            prismaStage.iconKey,
            prismaStage.variant,
            prismaStage.content
        );
    }

    /**
     * Convert domain model to Prisma input
     */
    protected toPrisma(stage: Partial<Stage>): any {
        const prismaData: any = {};

        if (stage.title !== undefined) prismaData.title = stage.title;
        if (stage.slug !== undefined) prismaData.slug = stage.slug;
        if (stage.description !== undefined) prismaData.description = stage.description;
        if (stage.status !== undefined) prismaData.status = stage.status;
        if (stage.sequenceOrder !== undefined) prismaData.sequenceOrder = stage.sequenceOrder;
        if (stage.isVisible !== undefined) prismaData.isVisible = stage.isVisible;
        if (stage.iconKey !== undefined) prismaData.iconKey = stage.iconKey;
        if (stage.variant !== undefined) prismaData.variant = stage.variant;
        if (stage.content !== undefined) prismaData.content = stage.content;

        return prismaData;
    }

    /**
     * Find stage by slug
     */
    async findBySlug(slug: string): Promise<Stage | null> {
        try {
            const stage = await db.stage.findUnique({
                where: { slug },
            });
            return stage ? this.toDomain(stage) : null;
        } catch (error) {
            throw new DatabaseError('Failed to find stage by slug', error as Error);
        }
    }

    /**
     * Find the currently active stage
     */
    async findActive(): Promise<Stage | null> {
        try {
            const stage = await db.stage.findFirst({
                where: { status: StageStatus.ACTIVE },
            });
            return stage ? this.toDomain(stage) : null;
        } catch (error) {
            throw new DatabaseError('Failed to find active stage', error as Error);
        }
    }

    /**
     * Find all visible stages ordered by sequence
     */
    async findAllVisible(): Promise<Stage[]> {
        try {
            const stages = await db.stage.findMany({
                where: { isVisible: true },
                orderBy: { sequenceOrder: 'asc' },
            });
            return stages.map(s => this.toDomain(s));
        } catch (error) {
            throw new DatabaseError('Failed to find visible stages', error as Error);
        }
    }

    /**
     * Find all stages ordered by sequence
     */
    async findAllOrdered(): Promise<Stage[]> {
        try {
            const stages = await db.stage.findMany({
                orderBy: { sequenceOrder: 'asc' },
            });
            return stages.map(s => this.toDomain(s));
        } catch (error) {
            throw new DatabaseError('Failed to find ordered stages', error as Error);
        }
    }

    /**
     * Find stages by status
     */
    async findByStatus(status: StageStatus): Promise<Stage[]> {
        try {
            const stages = await db.stage.findMany({
                where: { status },
                orderBy: { sequenceOrder: 'asc' },
            });
            return stages.map(s => this.toDomain(s));
        } catch (error) {
            throw new DatabaseError('Failed to find stages by status', error as Error);
        }
    }

    /**
     * Find stage before a given sequence order
     */
    async findPrevious(sequenceOrder: number): Promise<Stage | null> {
        try {
            const stage = await db.stage.findFirst({
                where: { sequenceOrder: { lt: sequenceOrder } },
                orderBy: { sequenceOrder: 'desc' },
            });
            return stage ? this.toDomain(stage) : null;
        } catch (error) {
            throw new DatabaseError('Failed to find previous stage', error as Error);
        }
    }

    /**
     * Find stage after a given sequence order
     */
    async findNext(sequenceOrder: number): Promise<Stage | null> {
        try {
            const stage = await db.stage.findFirst({
                where: { sequenceOrder: { gt: sequenceOrder } },
                orderBy: { sequenceOrder: 'asc' },
            });
            return stage ? this.toDomain(stage) : null;
        } catch (error) {
            throw new DatabaseError('Failed to find next stage', error as Error);
        }
    }

    /**
     * Update stages with sequence order less than target
     */
    async updateBeforeSequence(
        sequenceOrder: number,
        data: Partial<Stage>
    ): Promise<number> {
        try {
            const result = await db.stage.updateMany({
                where: { sequenceOrder: { lt: sequenceOrder } },
                data: this.toPrisma(data),
            });
            return result.count;
        } catch (error) {
            throw new DatabaseError('Failed to update stages before sequence', error as Error);
        }
    }

    /**
     * Update stages with sequence order greater than target
     */
    async updateAfterSequence(
        sequenceOrder: number,
        data: Partial<Stage>
    ): Promise<number> {
        try {
            const result = await db.stage.updateMany({
                where: { sequenceOrder: { gt: sequenceOrder } },
                data: this.toPrisma(data),
            });
            return result.count;
        } catch (error) {
            throw new DatabaseError('Failed to update stages after sequence', error as Error);
        }
    }
}

// Export singleton instance
export const stageRepository = new StageRepository();
