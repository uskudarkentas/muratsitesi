// Page Builder Type Definitions

export type BlockType =
    | 'hero'
    | 'info-card-grid'
    | 'announcement-banner'
    | 'document-list'
    | 'text'
    | 'image'
    | 'divider';

export interface BaseBlock {
    id: string;
    type: BlockType;
    order: number;
}

export interface HeroBlock extends BaseBlock {
    type: 'hero';
    data: {
        title: string;
        description: string;
        backgroundImage?: string;
        ctaText?: string;
        ctaLink?: string;
    };
}

export interface InfoCard {
    id: string;
    icon: string; // Material icon key
    title: string;
    description: string;
}

export interface InfoCardGridBlock extends BaseBlock {
    type: 'info-card-grid';
    data: {
        cards: InfoCard[];
    };
}

export interface AnnouncementBannerBlock extends BaseBlock {
    type: 'announcement-banner';
    data: {
        icon: string;
        title: string;
        description: string;
        backgroundColor?: string;
    };
}

export interface DocumentItem {
    id: string;
    title: string;
    fileUrl: string;
    fileSize?: string;
    uploadDate?: string;
}

export interface DocumentListBlock extends BaseBlock {
    type: 'document-list';
    data: {
        title: string;
        documents: DocumentItem[];
    };
}

export interface TextBlock extends BaseBlock {
    type: 'text';
    data: {
        content: string; // HTML or markdown
    };
}

export interface ImageBlock extends BaseBlock {
    type: 'image';
    data: {
        url: string;
        alt: string;
        caption?: string;
    };
}

export interface DividerBlock extends BaseBlock {
    type: 'divider';
    data: Record<string, never>; // Empty object
}

export type ContentBlock =
    | HeroBlock
    | InfoCardGridBlock
    | AnnouncementBannerBlock
    | DocumentListBlock
    | TextBlock
    | ImageBlock
    | DividerBlock;

export interface PageContentData {
    id: number;
    slug: string;
    blocks: ContentBlock[];
    isTemplate: boolean;
    updatedAt: Date;
    createdAt: Date;
}
