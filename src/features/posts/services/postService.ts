import { BaseService } from '@/core/services/base.service';
import { Post, PostType } from '@/entities/post/model';
import { PostRepository, postRepository } from '../repositories/postRepository';
import { NotFoundError, ValidationError } from '@/core/errors/AppError';

/**
 * Post Service
 * 
 * Contains business logic for post management (announcements, meetings, surveys).
 * Orchestrates repository operations and enforces domain rules.
 */
export class PostService extends BaseService<Post, PostRepository> {
    constructor(repository: PostRepository = postRepository) {
        super(repository);
    }

    /**
     * Get all posts for a stage
     */
    async getPostsByStage(stageId: number): Promise<Post[]> {
        return this.repository.findByStageId(stageId);
    }

    /**
     * Get published posts for a stage
     */
    async getPublishedPostsByStage(stageId: number): Promise<Post[]> {
        return this.repository.findPublishedByStageId(stageId);
    }

    /**
     * Get latest published post for a stage
     */
    async getLatestPost(stageId: number): Promise<Post | null> {
        return this.repository.findLatestPublished(stageId);
    }

    /**
     * Get post by ID
     */
    async getPostById(id: string): Promise<Post> {
        const post = await this.repository.findById(id);
        if (!post) {
            throw new NotFoundError('Post', id);
        }
        return post;
    }

    /**
     * Get upcoming events (meetings and surveys)
     */
    async getUpcomingEvents(): Promise<Post[]> {
        return this.repository.findUpcomingEvents();
    }

    /**
     * Get active surveys
     */
    async getActiveSurveys(): Promise<Post[]> {
        return this.repository.findActiveSurveys();
    }

    /**
     * Create a new post
     */
    async createPost(data: {
        stageId: number;
        type: PostType;
        title: string;
        content?: string;
        imageUrl?: string;
        attachmentUrl?: string;
        eventDate?: Date;
        isPublished?: boolean;
    }): Promise<Post> {
        await this.validate(data);

        const post = await this.repository.create({
            stageId: data.stageId,
            type: data.type,
            title: data.title,
            content: data.content || null,
            imageUrl: data.imageUrl || null,
            attachmentUrl: data.attachmentUrl || null,
            eventDate: data.eventDate || null,
            isPublished: data.isPublished ?? false,
            publishedAt: data.isPublished ? new Date() : null,
        });

        return post;
    }

    /**
     * Update a post
     */
    async updatePost(
        id: string,
        data: {
            title?: string;
            content?: string;
            imageUrl?: string;
            attachmentUrl?: string;
            eventDate?: Date;
            isPublished?: boolean;
        }
    ): Promise<Post> {
        const post = await this.getPostById(id);

        // If publishing, set publishedAt
        const updateData: any = { ...data };
        if (data.isPublished === true && !post.isPublished) {
            updateData.publishedAt = new Date();
        } else if (data.isPublished === false) {
            updateData.publishedAt = null;
        }

        return this.repository.update(id, updateData);
    }

    /**
     * Publish a post
     */
    async publishPost(id: string): Promise<Post> {
        const post = await this.getPostById(id);
        post.publish();

        return this.repository.update(id, {
            isPublished: true,
            publishedAt: new Date(),
        } as any);
    }

    /**
     * Unpublish a post
     */
    async unpublishPost(id: string): Promise<Post> {
        const post = await this.getPostById(id);
        post.unpublish();

        return this.repository.update(id, {
            isPublished: false,
            publishedAt: null,
        } as any);
    }

    /**
     * Delete a post
     */
    async deletePost(id: string): Promise<void> {
        await this.getPostById(id); // Ensure exists
        await this.repository.delete(id);
    }

    /**
     * Delete all posts for a stage
     */
    async deletePostsByStage(stageId: number): Promise<number> {
        return this.repository.deleteByStageId(stageId);
    }

    /**
     * Get posts by type
     */
    async getPostsByType(type: PostType): Promise<Post[]> {
        return this.repository.findByType(type);
    }

    /**
     * Check if a post's event has passed
     */
    async isEventPast(id: string): Promise<boolean> {
        const post = await this.getPostById(id);
        return post.isEventPast();
    }

    /**
     * Get days until event
     */
    async getDaysUntilEvent(id: string): Promise<number | null> {
        const post = await this.getPostById(id);
        return post.getDaysUntilEvent();
    }

    /**
     * Validate post data
     */
    protected async validate(data: any): Promise<void> {
        if (!data.title || data.title.trim() === '') {
            throw new ValidationError('Post title is required');
        }

        if (!data.type) {
            throw new ValidationError('Post type is required');
        }

        if (!Object.values(PostType).includes(data.type)) {
            throw new ValidationError('Invalid post type');
        }

        // Validate event date for meetings and surveys
        if (
            (data.type === PostType.MEETING || data.type === PostType.SURVEY) &&
            !data.eventDate
        ) {
            throw new ValidationError(
                `Event date is required for ${data.type.toLowerCase()}s`
            );
        }
    }
}

// Export singleton instance
export const postService = new PostService();
