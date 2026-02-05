/**
 * Stage Status Enum
 */
export enum StageStatus {
    LOCKED = 'LOCKED',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
}

/**
 * Stage Domain Model
 * 
 * Represents a stage in the urban transformation process.
 * Contains business logic and domain rules.
 */
export class Stage {
    constructor(
        public readonly id: number,
        public title: string,
        public slug: string,
        public description: string | null,
        public status: StageStatus,
        public sequenceOrder: number,
        public isVisible: boolean,
        public iconKey: string,
        public variant: string,
        public content: string | null
    ) { }

    /**
     * Check if this stage is currently active
     */
    isActive(): boolean {
        return this.status === StageStatus.ACTIVE;
    }

    /**
     * Check if this stage is completed
     */
    isCompleted(): boolean {
        return this.status === StageStatus.COMPLETED;
    }

    /**
     * Check if this stage is locked (future)
     */
    isLocked(): boolean {
        return this.status === StageStatus.LOCKED;
    }

    /**
     * Check if this stage can transition to a new status
     * Business Rule: Status transitions must follow LOCKED -> ACTIVE -> COMPLETED
     */
    canTransitionTo(newStatus: StageStatus): boolean {
        // Can't transition to same status
        if (this.status === newStatus) {
            return false;
        }

        // LOCKED can only go to ACTIVE
        if (this.status === StageStatus.LOCKED) {
            return newStatus === StageStatus.ACTIVE;
        }

        // ACTIVE can only go to COMPLETED
        if (this.status === StageStatus.ACTIVE) {
            return newStatus === StageStatus.COMPLETED;
        }

        // COMPLETED cannot transition (final state)
        return false;
    }

    /**
     * Check if this stage should be displayed
     */
    shouldDisplay(): boolean {
        return this.isVisible;
    }

    /**
     * Get display order
     */
    getOrder(): number {
        return this.sequenceOrder;
    }

    /**
     * Check if this is a special variant (e.g., "small" for Temsili Sözleşme)
     */
    isSpecialVariant(): boolean {
        return this.variant !== 'default';
    }

    /**
     * Convert to plain object for serialization
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            slug: this.slug,
            description: this.description,
            status: this.status,
            sequenceOrder: this.sequenceOrder,
            isVisible: this.isVisible,
            iconKey: this.iconKey,
            variant: this.variant,
            content: this.content,
        };
    }

    /**
     * Create from plain object
     */
    static fromJSON(data: any): Stage {
        return new Stage(
            data.id,
            data.title,
            data.slug,
            data.description,
            data.status as StageStatus,
            data.sequenceOrder,
            data.isVisible,
            data.iconKey,
            data.variant,
            data.content
        );
    }
}
