/**
 * PageContent Domain Model
 * 
 * Represents a page's content built with the page builder.
 */
export class PageContent {
    constructor(
        public readonly id: number,
        public slug: string,
        public blocks: any[], // ContentBlock[] - keeping as any to avoid circular dependency
        public isTemplate: boolean,
        public readonly createdAt: Date,
        public updatedAt: Date,
        public stageOrder?: number // Added optional stageOrder
    ) { }

    // ... (keep existing methods)

    /**
     * Convert to plain object for serialization
     */
    toJSON() {
        return {
            id: this.id,
            slug: this.slug,
            blocks: this.blocks,
            isTemplate: this.isTemplate,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            stageOrder: this.stageOrder, // Include stageOrder
        };
    }

    /**
     * Create from plain object
     */
    static fromJSON(data: any): PageContent {
        return new PageContent(
            data.id,
            data.slug,
            data.blocks,
            data.isTemplate,
            new Date(data.createdAt),
            new Date(data.updatedAt),
            data.stageOrder // Include stageOrder
        );
    }
}
