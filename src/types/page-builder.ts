// Page Builder Type Definitions

export type BlockType =
    | 'hero'
    | 'info-card-grid'
    | 'announcement-banner'
    | 'document-list'
    | 'text'
    | 'image'
    | 'divider'
    | 'list'
    | 'slider'
    | 'document-preview'
    | 'video'
    | 'image-grid';

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
        layout?: 'banner' | 'article';
        imageUrl?: string;
        attachmentUrl?: string;
        attachmentText?: string;
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
        title?: string; // Added optional title
        content: string; // HTML or markdown
    };
}

export interface ListBlock extends BaseBlock {
    type: 'list';
    data: {
        title?: string;
        items: string[];
        listType?: 'disc' | 'decimal'; // 'disc' (bullet) or 'decimal' (numbered)
    };
}

export interface ImageBlock extends BaseBlock {
    type: 'image';
    data: {
        url: string;
        alt: string;
        caption?: string;
        aspectRatio?: '21/9' | '16/9' | '4/3' | '1/1' | 'auto';
    };
}

export interface DocumentPreviewBlock extends BaseBlock {
    type: 'document-preview';
    data: {
        url: string;
        title: string;
        description?: string;
        buttonText?: string;
    };
}

export interface SliderSlide {
    id: string;
    url: string;
    caption?: string;
    title?: string;
}

export interface SliderBlock extends BaseBlock {
    type: 'slider';
    data: {
        slides: SliderSlide[];
    };
}


export interface DividerBlock extends BaseBlock {
    type: 'divider';
    data: Record<string, never>; // Empty object
}

export interface VideoBlock extends BaseBlock {
    type: 'video';
    data: {
        url: string;
        title: string;
        description?: string;
        buttonText?: string;
    };
}

export interface GridImage {
    id: string;
    url: string;
    alt: string;
}

export interface ImageGridBlock extends BaseBlock {
    type: 'image-grid';
    data: {
        columns: 2 | 3 | 4;
        images: GridImage[];
        aspectRatio?: '21/9' | '16/9' | '4/3' | '1/1' | '3/4' | '9/16' | 'auto';
    };
}

export type ContentBlock =
    | HeroBlock
    | InfoCardGridBlock
    | AnnouncementBannerBlock
    | DocumentListBlock
    | TextBlock
    | ListBlock
    | ImageBlock
    | DividerBlock
    | SliderBlock
    | DocumentPreviewBlock
    | VideoBlock
    | ImageGridBlock;

export interface PageContentData {
    id: number;
    slug: string;
    blocks: ContentBlock[];
    isTemplate: boolean;
    updatedAt: Date;
    updatedAt: Date;
    createdAt: Date;
    stageOrder?: number;
}
