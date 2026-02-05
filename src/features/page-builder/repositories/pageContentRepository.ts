import { BaseRepository } from '@/core/repositories/base.repository';
import { db } from '@/core/database/client';
import { PageContent } from '@/entities/page-content/model';
import {
    PageContentWhereInput,
    PageContentCreateInput,
    PageContentUpdateInput,
} from '@/core/database/types';
import { DatabaseError } from '@/core/errors/AppError';

/**
 * PageContent Repository
 * 
 * Handles all database operations for page content.
 * Converts between Prisma models and domain models.
 */
export class PageContentRepository extends BaseRepository<
    PageContent,
    PageContentCreateInput,
    PageContentUpdateInput,
    PageContentWhereInput
> {
    protected get model() {
        return db.pageContent;
    }

    /**
     * Convert Prisma pageContent to domain model
     */
    protected toDomain(prismaPageContent: any): PageContent {
        // Parse blocks from JSON string
        const blocks = typeof prismaPageContent.blocks === 'string'
            ? JSON.parse(prismaPageContent.blocks)
            : prismaPageContent.blocks;

        return new PageContent(
            prismaPageContent.id,
            prismaPageContent.slug,
            blocks,
            prismaPageContent.isTemplate,
            prismaPageContent.createdAt,
            prismaPageContent.updatedAt
        );
    }

    /**
     * Convert domain model to Prisma input
     */
    protected toPrisma(pageContent: Partial<PageContent>): any {
        const prismaData: any = {};

        if (pageContent.slug !== undefined) prismaData.slug = pageContent.slug;
        if (pageContent.blocks !== undefined) {
            prismaData.blocks = JSON.stringify(pageContent.blocks);
        }
        if (pageContent.isTemplate !== undefined) {
            prismaData.isTemplate = pageContent.isTemplate;
        }

        return prismaData;
    }

    /**
     * Find page content by slug
     */
    async findBySlug(slug: string): Promise<PageContent | null> {
        try {
            const pageContent = await db.pageContent.findUnique({
                where: { slug },
            });
            return pageContent ? this.toDomain(pageContent) : null;
        } catch (error) {
            throw new DatabaseError('Failed to find page content by slug', error as Error);
        }
    }

    /**
     * Find all templates
     */
    async findTemplates(): Promise<PageContent[]> {
        try {
            const templates = await db.pageContent.findMany({
                where: { isTemplate: true },
                orderBy: { updatedAt: 'desc' },
            });
            return templates.map(t => this.toDomain(t));
        } catch (error) {
            throw new DatabaseError('Failed to find templates', error as Error);
        }
    }

    /**
     * Find all non-template pages
     */
    async findPages(): Promise<PageContent[]> {
        try {
            const pages = await db.pageContent.findMany({
                where: { isTemplate: false },
                orderBy: { updatedAt: 'desc' },
            });
            return pages.map(p => this.toDomain(p));
        } catch (error) {
            throw new DatabaseError('Failed to find pages', error as Error);
        }
    }

    /**
     * Upsert page content (create or update)
     */
    async upsert(slug: string, data: Partial<PageContent>): Promise<PageContent> {
        try {
            const prismaData = this.toPrisma(data);
            const result = await db.pageContent.upsert({
                where: { slug },
                update: prismaData,
                create: {
                    slug,
                    ...prismaData,
                },
            });
            return this.toDomain(result);
        } catch (error) {
            throw new DatabaseError('Failed to upsert page content', error as Error);
        }
    }

    /**
     * Check if page exists by slug
     */
    async existsBySlug(slug: string): Promise<boolean> {
        try {
            const count = await db.pageContent.count({
                where: { slug },
            });
            return count > 0;
        } catch (error) {
            throw new DatabaseError('Failed to check page existence', error as Error);
        }
    }
}

// Export singleton instance
export const pageContentRepository = new PageContentRepository();
