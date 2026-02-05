import { BaseService } from '@/core/services/base.service';
import { PageContent } from '@/entities/page-content/model';
import { PageContentRepository, pageContentRepository } from '../repositories/pageContentRepository';
import { NotFoundError, ValidationError } from '@/core/errors/AppError';

/**
 * PageBuilder Service
 * 
 * Contains business logic for page content management.
 * Handles page builder operations and content validation.
 */
export class PageBuilderService extends BaseService<PageContent, PageContentRepository> {
    constructor(repository: PageContentRepository = pageContentRepository) {
        super(repository);
    }

    /**
     * Get page content by slug
     */
    async getPageContent(slug: string): Promise<PageContent> {
        const content = await this.repository.findBySlug(slug);
        if (!content) {
            throw new NotFoundError('Page content', slug);
        }
        return content;
    }

    /**
     * Get page content by slug or return null
     */
    async getPageContentOrNull(slug: string): Promise<PageContent | null> {
        return this.repository.findBySlug(slug);
    }

    /**
     * Get all templates
     */
    async getTemplates(): Promise<PageContent[]> {
        return this.repository.findTemplates();
    }

    /**
     * Get all pages (non-templates)
     */
    async getPages(): Promise<PageContent[]> {
        return this.repository.findPages();
    }

    /**
     * Create or update page content
     */
    async savePageContent(slug: string, blocks: any[]): Promise<PageContent> {
        await this.validateBlocks(blocks);

        return this.repository.upsert(slug, {
            blocks,
            isTemplate: false,
        } as Partial<PageContent>);
    }

    /**
     * Create a template
     */
    async createTemplate(slug: string, blocks: any[]): Promise<PageContent> {
        await this.validateBlocks(blocks);

        // Check if template already exists
        const existing = await this.repository.findBySlug(slug);
        if (existing) {
            throw new ValidationError(`Template with slug "${slug}" already exists`);
        }

        return this.repository.create({
            slug,
            blocks: JSON.stringify(blocks),
            isTemplate: true,
        });
    }

    /**
     * Update page content blocks
     */
    async updateBlocks(slug: string, blocks: any[]): Promise<PageContent> {
        await this.validateBlocks(blocks);

        const content = await this.getPageContent(slug);
        return this.repository.update(content.id, {
            blocks: JSON.stringify(blocks),
        } as any);
    }

    /**
     * Delete page content
     */
    async deletePageContent(slug: string): Promise<void> {
        const content = await this.getPageContent(slug);
        await this.repository.delete(content.id);
    }

    /**
     * Check if page exists
     */
    async pageExists(slug: string): Promise<boolean> {
        return this.repository.existsBySlug(slug);
    }

    /**
     * Get blocks of a specific type from a page
     */
    async getBlocksByType(slug: string, blockType: string): Promise<any[]> {
        const content = await this.getPageContent(slug);
        return content.getBlocksByType(blockType);
    }

    /**
     * Count blocks in a page
     */
    async getBlockCount(slug: string): Promise<number> {
        const content = await this.getPageContent(slug);
        return content.getBlockCount();
    }

    /**
     * Duplicate a page
     */
    async duplicatePage(sourceSlug: string, targetSlug: string): Promise<PageContent> {
        const source = await this.getPageContent(sourceSlug);

        // Check if target already exists
        const existing = await this.repository.findBySlug(targetSlug);
        if (existing) {
            throw new ValidationError(`Page with slug "${targetSlug}" already exists`);
        }

        return this.repository.create({
            slug: targetSlug,
            blocks: JSON.stringify(source.blocks),
            isTemplate: source.isTemplate,
        });
    }

    /**
     * Validate blocks array
     */
    private async validateBlocks(blocks: any[]): Promise<void> {
        if (!Array.isArray(blocks)) {
            throw new ValidationError('Blocks must be an array');
        }

        // Validate each block has required fields
        for (const block of blocks) {
            if (!block.id) {
                throw new ValidationError('Each block must have an id');
            }
            if (!block.type) {
                throw new ValidationError('Each block must have a type');
            }
            if (block.order === undefined) {
                throw new ValidationError('Each block must have an order');
            }
        }

        // Validate unique IDs
        const ids = blocks.map(b => b.id);
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
            throw new ValidationError('Block IDs must be unique');
        }
    }

    /**
     * Validate page data
     */
    protected async validate(data: any): Promise<void> {
        if (!data.slug || data.slug.trim() === '') {
            throw new ValidationError('Page slug is required');
        }

        // Validate slug format
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(data.slug)) {
            throw new ValidationError(
                'Slug must contain only lowercase letters, numbers, and hyphens'
            );
        }
    }
}

// Export singleton instance
export const pageBuilderService = new PageBuilderService();
