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
        public updatedAt: Date
    ) { }

    /**
     * Check if this is a template
     */
    isTemplateContent(): boolean {
        return this.isTemplate;
    }

    /**
     * Check if page has content
     */
    hasContent(): boolean {
        return this.blocks.length > 0;
    }

    /**
     * Get number of blocks
     */
    getBlockCount(): number {
        return this.blocks.length;
    }

    /**
     * Check if page is empty
     */
    isEmpty(): boolean {
        return this.blocks.length === 0;
    }

    /**
     * Get blocks of a specific type
     */
    getBlocksByType(type: string): any[] {
        return this.blocks.filter(block => block.type === type);
    }

    /**
     * Check if page has a specific block type
     */
    hasBlockType(type: string): boolean {
        return this.blocks.some(block => block.type === type);
    }

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
            new Date(data.updatedAt)
        );
    }
}
