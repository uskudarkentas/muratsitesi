import { BaseRepository } from '@/core/repositories/base.repository';
import { db } from '@/core/database/client';
import { Post, PostType } from '@/entities/post/model';
import {
    PostWhereInput,
    PostCreateInput,
    PostUpdateInput,
} from '@/core/database/types';
import { DatabaseError } from '@/core/errors/AppError';

/**
 * Post Repository
 * 
 * Handles all database operations for posts (announcements, meetings, surveys).
 * Converts between Prisma models and domain models.
 */
export class PostRepository extends BaseRepository<
    Post,
    PostCreateInput,
    PostUpdateInput,
    PostWhereInput
> {
    protected get model() {
        return db.post;
    }

    /**
     * Convert Prisma post to domain model
     */
    protected toDomain(prismaPost: any): Post {
        return new Post(
            prismaPost.id,
            prismaPost.stageId,
            prismaPost.type as PostType,
            prismaPost.title,
            prismaPost.content,
            prismaPost.imageUrl,
            prismaPost.attachmentUrl,
            prismaPost.isPublished,
            prismaPost.publishedAt,
            prismaPost.eventDate,
            prismaPost.createdAt
        );
    }

    /**
     * Convert domain model to Prisma input
     */
    protected toPrisma(post: Partial<Post>): any {
        const prismaData: any = {};

        if (post.stageId !== undefined) prismaData.stageId = post.stageId;
        if (post.type !== undefined) prismaData.type = post.type;
        if (post.title !== undefined) prismaData.title = post.title;
        if (post.content !== undefined) prismaData.content = post.content;
        if (post.imageUrl !== undefined) prismaData.imageUrl = post.imageUrl;
        if (post.attachmentUrl !== undefined) prismaData.attachmentUrl = post.attachmentUrl;
        if (post.isPublished !== undefined) prismaData.isPublished = post.isPublished;
        if (post.publishedAt !== undefined) prismaData.publishedAt = post.publishedAt;
        if (post.eventDate !== undefined) prismaData.eventDate = post.eventDate;

        return prismaData;
    }

    /**
     * Find posts by stage ID
     */
    async findByStageId(stageId: number): Promise<Post[]> {
        try {
            const posts = await db.post.findMany({
                where: { stageId },
                orderBy: { createdAt: 'desc' },
            });
            return posts.map(p => this.toDomain(p));
        } catch (error) {
            throw new DatabaseError('Failed to find posts by stage', error as Error);
        }
    }

    /**
     * Find published posts by stage ID
     */
    async findPublishedByStageId(stageId: number): Promise<Post[]> {
        try {
            const posts = await db.post.findMany({
                where: {
                    stageId,
                    isPublished: true,
                },
                orderBy: { publishedAt: 'desc' },
            });
            return posts.map(p => this.toDomain(p));
        } catch (error) {
            throw new DatabaseError('Failed to find published posts', error as Error);
        }
    }

    /**
     * Find latest published post for a stage
     */
    async findLatestPublished(stageId: number): Promise<Post | null> {
        try {
            const post = await db.post.findFirst({
                where: {
                    stageId,
                    isPublished: true,
                },
                orderBy: { publishedAt: 'desc' },
            });
            return post ? this.toDomain(post) : null;
        } catch (error) {
            throw new DatabaseError('Failed to find latest published post', error as Error);
        }
    }

    /**
     * Find posts by type
     */
    async findByType(type: PostType): Promise<Post[]> {
        try {
            const posts = await db.post.findMany({
                where: { type },
                orderBy: { createdAt: 'desc' },
            });
            return posts.map(p => this.toDomain(p));
        } catch (error) {
            throw new DatabaseError('Failed to find posts by type', error as Error);
        }
    }

    /**
     * Find upcoming events (meetings and surveys with future dates)
     */
    async findUpcomingEvents(): Promise<Post[]> {
        try {
            const posts = await db.post.findMany({
                where: {
                    isPublished: true,
                    type: { in: [PostType.MEETING, PostType.SURVEY] },
                    OR: [
                        { eventDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
                        { expiresAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
                    ]
                },
                orderBy: [
                    { eventDate: 'asc' }, // Soonest events first
                    { createdAt: 'desc' } // Fallback to newest created
                ]
            });
            return posts.map(p => this.toDomain(p));
        } catch (error) {
            throw new DatabaseError('Failed to find upcoming events', error as Error);
        }
    }

    /**
     * Find active surveys (published surveys with future event dates)
     */
    async findActiveSurveys(): Promise<Post[]> {
        try {
            const posts = await db.post.findMany({
                where: {
                    type: PostType.SURVEY,
                    eventDate: { gt: new Date() },
                    isPublished: true,
                },
                orderBy: { eventDate: 'asc' },
            });
            return posts.map(p => this.toDomain(p));
        } catch (error) {
            throw new DatabaseError('Failed to find active surveys', error as Error);
        }
    }

    /**
     * Delete all posts for a stage
     */
    async deleteByStageId(stageId: number): Promise<number> {
        try {
            const result = await db.post.deleteMany({
                where: { stageId },
            });
            return result.count;
        } catch (error) {
            throw new DatabaseError('Failed to delete posts by stage', error as Error);
        }
    }
}

// Export singleton instance
export const postRepository = new PostRepository();
