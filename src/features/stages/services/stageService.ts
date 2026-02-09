import { BaseService } from '@/core/services/base.service';
import { Stage, StageStatus } from '@/entities/stage/model';
import { StageRepository, stageRepository } from '../repositories/stageRepository';
import { NotFoundError, ValidationError, ConflictError } from '@/core/errors/AppError';

/**
 * Stage Service
 * 
 * Contains business logic for stage management.
 * Orchestrates repository operations and enforces domain rules.
 */
export class StageService extends BaseService<Stage, StageRepository> {
    constructor(repository: StageRepository = stageRepository) {
        super(repository);
    }

    /**
     * Get all stages ordered by sequence
     */
    async getAllStages(): Promise<Stage[]> {
        return this.repository.findAllOrdered();
    }

    /**
     * Get all visible stages
     */
    async getVisibleStages(): Promise<Stage[]> {
        return this.repository.findAllVisible();
    }

    /**
     * Get stage by ID
     */
    async getStageById(id: number): Promise<Stage> {
        const stage = await this.repository.findById(id);
        if (!stage) {
            throw new NotFoundError('Stage', id);
        }
        return stage;
    }

    /**
     * Get stage by slug
     */
    async getStageBySlug(slug: string): Promise<Stage> {
        const stage = await this.repository.findBySlug(slug);
        if (!stage) {
            throw new NotFoundError('Stage', slug);
        }
        return stage;
    }

    /**
     * Get the currently active stage
     */
    async getActiveStage(): Promise<Stage | null> {
        return this.repository.findActive();
    }

    /**
     * Get stages by status
     */
    async getStagesByStatus(status: StageStatus): Promise<Stage[]> {
        return this.repository.findByStatus(status);
    }

    /**
     * Create a new stage
     */
    async createStage(data: {
        title: string;
        slug: string;
        description?: string;
        iconKey: string;
        variant?: string;
        sequenceOrder: number;
        status?: StageStatus;
        isVisible?: boolean;
    }): Promise<Stage> {
        // Validate slug uniqueness
        const existing = await this.repository.findBySlug(data.slug);
        if (existing) {
            throw new ConflictError(`Stage with slug "${data.slug}" already exists`);
        }

        // If status is ACTIVE, handle cascade updates in transaction
        if (data.status === StageStatus.ACTIVE) {
            return this.repository.transaction(async () => {
                // Update stages before target to COMPLETED
                await this.repository.updateBeforeSequence(data.sequenceOrder, {
                    status: StageStatus.COMPLETED,
                } as Partial<Stage>);

                // Update stages after target to LOCKED
                await this.repository.updateAfterSequence(data.sequenceOrder, {
                    status: StageStatus.LOCKED,
                } as Partial<Stage>);

                // Create the new active stage
                return this.repository.create({
                    title: data.title,
                    slug: data.slug,
                    description: data.description || null,
                    iconKey: data.iconKey,
                    variant: data.variant || 'default',
                    sequenceOrder: data.sequenceOrder,
                    status: StageStatus.ACTIVE,
                    isVisible: data.isVisible ?? true,
                    content: null,
                });
            });
        }

        // Normal creation (LOCKED or COMPLETED without cascade, usually LOCKED)
        return this.repository.create({
            title: data.title,
            slug: data.slug,
            description: data.description || null,
            iconKey: data.iconKey,
            variant: data.variant || 'default',
            sequenceOrder: data.sequenceOrder,
            status: data.status || StageStatus.LOCKED,
            isVisible: data.isVisible ?? true,
            content: null,
        });
    }

    /**
     * Update a stage
     * 
     * Business Rule: When setting a stage to ACTIVE, automatically update other stages:
     * - Stages before it become COMPLETED
     * - Stages after it become LOCKED
     */
    async updateStage(
        id: number,
        data: {
            title?: string;
            description?: string;
            iconKey?: string;
            status?: StageStatus;
            sequenceOrder?: number;
            isVisible?: boolean;
            variant?: string;
        }
    ): Promise<Stage> {
        // Get existing stage
        const stage = await this.getStageById(id);

        // If status is being set to ACTIVE, handle cascade updates
        if (data.status === StageStatus.ACTIVE) {
            const targetOrder = data.sequenceOrder ?? stage.sequenceOrder;

            // Use transaction to ensure atomicity
            await this.repository.transaction(async () => {
                // Update stages before target to COMPLETED
                await this.repository.updateBeforeSequence(targetOrder, {
                    status: StageStatus.COMPLETED,
                } as Partial<Stage>);

                // Update stages after target to LOCKED
                await this.repository.updateAfterSequence(targetOrder, {
                    status: StageStatus.LOCKED,
                } as Partial<Stage>);

                // Update the target stage
                await this.repository.update(id, data);
            });

            // Return updated stage
            return this.getStageById(id);
        }

        // Normal update (no cascade)
        return this.repository.update(id, data);
    }

    /**
     * Delete a stage
     */
    async deleteStage(id: number): Promise<void> {
        const stage = await this.getStageById(id);
        await this.repository.delete(id);
    }

    /**
     * Reorder stages
     */
    async reorderStages(stageIds: number[]): Promise<void> {
        // Update sequence order for each stage
        const updates = stageIds.map((id, index) =>
            this.repository.update(id, { sequenceOrder: index } as any)
        );

        await Promise.all(updates);
    }

    /**
     * Toggle stage visibility
     */
    async toggleVisibility(id: number): Promise<Stage> {
        const stage = await this.getStageById(id);
        return this.repository.update(id, {
            isVisible: !stage.isVisible,
        } as any);
    }

    /**
     * Get next stage in sequence
     */
    async getNextStage(currentStageId: number): Promise<Stage | null> {
        const currentStage = await this.getStageById(currentStageId);
        return this.repository.findNext(currentStage.sequenceOrder);
    }

    /**
     * Get previous stage in sequence
     */
    async getPreviousStage(currentStageId: number): Promise<Stage | null> {
        const currentStage = await this.getStageById(currentStageId);
        return this.repository.findPrevious(currentStage.sequenceOrder);
    }

    /**
     * Validate stage data
     */
    protected async validate(data: any): Promise<void> {
        if (!data.title || data.title.trim() === '') {
            throw new ValidationError('Stage title is required');
        }

        if (!data.slug || data.slug.trim() === '') {
            throw new ValidationError('Stage slug is required');
        }

        // Validate slug format (lowercase, hyphens only)
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(data.slug)) {
            throw new ValidationError(
                'Slug must contain only lowercase letters, numbers, and hyphens'
            );
        }
    }
}

// Export singleton instance
export const stageService = new StageService();
