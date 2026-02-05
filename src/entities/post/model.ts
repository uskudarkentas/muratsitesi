/**
 * Post Type Enum
 */
export enum PostType {
    ANNOUNCEMENT = 'ANNOUNCEMENT',
    MEETING = 'MEETING',
    SURVEY = 'SURVEY',
}

/**
 * Post Domain Model
 * 
 * Represents a post (announcement, meeting, or survey) associated with a stage.
 */
export class Post {
    constructor(
        public readonly id: string,
        public stageId: number,
        public type: PostType,
        public title: string,
        public content: string | null,
        public imageUrl: string | null,
        public attachmentUrl: string | null,
        public isPublished: boolean,
        public publishedAt: Date | null,
        public eventDate: Date | null,
        public readonly createdAt: Date
    ) { }

    /**
     * Check if this post is published
     */
    isLive(): boolean {
        return this.isPublished && this.publishedAt !== null;
    }

    /**
     * Check if this is an announcement
     */
    isAnnouncement(): boolean {
        return this.type === PostType.ANNOUNCEMENT;
    }

    /**
     * Check if this is a meeting
     */
    isMeeting(): boolean {
        return this.type === PostType.MEETING;
    }

    /**
     * Check if this is a survey
     */
    isSurvey(): boolean {
        return this.type === PostType.SURVEY;
    }

    /**
     * Check if this post has an event date
     */
    hasEventDate(): boolean {
        return this.eventDate !== null;
    }

    /**
     * Check if event has passed
     */
    isEventPast(): boolean {
        if (!this.eventDate) return false;
        return this.eventDate < new Date();
    }

    /**
     * Check if event is upcoming
     */
    isEventUpcoming(): boolean {
        if (!this.eventDate) return false;
        return this.eventDate > new Date();
    }

    /**
     * Get days until event
     */
    getDaysUntilEvent(): number | null {
        if (!this.eventDate) return null;
        const diff = this.eventDate.getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    /**
     * Check if post has attachments
     */
    hasAttachments(): boolean {
        return this.imageUrl !== null || this.attachmentUrl !== null;
    }

    /**
     * Publish this post
     */
    publish(): void {
        this.isPublished = true;
        this.publishedAt = new Date();
    }

    /**
     * Unpublish this post
     */
    unpublish(): void {
        this.isPublished = false;
        this.publishedAt = null;
    }

    /**
     * Convert to plain object for serialization
     */
    toJSON() {
        return {
            id: this.id,
            stageId: this.stageId,
            type: this.type,
            title: this.title,
            content: this.content,
            imageUrl: this.imageUrl,
            attachmentUrl: this.attachmentUrl,
            isPublished: this.isPublished,
            publishedAt: this.publishedAt,
            eventDate: this.eventDate,
            createdAt: this.createdAt,
        };
    }

    /**
     * Create from plain object
     */
    static fromJSON(data: any): Post {
        return new Post(
            data.id,
            data.stageId,
            data.type as PostType,
            data.title,
            data.content,
            data.imageUrl,
            data.attachmentUrl,
            data.isPublished,
            data.publishedAt ? new Date(data.publishedAt) : null,
            data.eventDate ? new Date(data.eventDate) : null,
            new Date(data.createdAt)
        );
    }
}
