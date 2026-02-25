import { ContentBlock } from "@/types/page-builder";
import { HeroSection } from "./blocks/HeroSection";
import { InfoCardGrid } from "./blocks/InfoCardGrid";
import { AnnouncementBanner } from "./blocks/AnnouncementBanner";
import { DocumentList } from "./blocks/DocumentList";
import { TextBlockComponent } from "./blocks/TextBlock";
import { ListBlockComponent } from "./blocks/ListBlock";
import { ImageBlockComponent } from "./blocks/ImageBlock";
import { DividerBlock } from "./blocks/DividerBlock";
import { DocumentPreviewBlockComponent } from "./blocks/DocumentPreviewBlock";
import { SliderBlockComponent } from "./blocks/SliderBlock";
import { VideoBlockComponent } from "./blocks/VideoBlock";
import { ImageGridBlockComponent } from "./blocks/ImageGridBlock";

interface BlockRendererProps {
    block: ContentBlock;
    isEditing?: boolean;
    onUpdate?: (newData: any) => void;
    pageSlug?: string;
    stageNumber?: number;
}

export function BlockRenderer({ block, isEditing = false, onUpdate, pageSlug, stageNumber }: BlockRendererProps) {

    if (!block) return null;

    switch (block.type) {
        case 'hero':
            return <HeroSection block={block} isEditing={isEditing} onUpdate={onUpdate} pageSlug={pageSlug} stageNumber={stageNumber} />;

        case 'info-card-grid':
            return <InfoCardGrid block={block} isEditing={isEditing} onUpdate={onUpdate} />;

        case 'announcement-banner':
            return <AnnouncementBanner block={block} isEditing={isEditing} onUpdate={onUpdate} />;

        case 'document-list':
            return <DocumentList block={block} isEditing={isEditing} onUpdate={onUpdate} />;

        case 'text':
            return <TextBlockComponent block={block} isEditing={isEditing} onUpdate={onUpdate} />;

        case 'list':
            return <ListBlockComponent block={block} isEditing={isEditing} onUpdate={onUpdate} />;

        case 'image':
            return <ImageBlockComponent block={block} isEditing={isEditing} onUpdate={onUpdate} />;

        case 'divider':
            return <DividerBlock />;

        case 'document-preview':
            // @ts-ignore
            return <DocumentPreviewBlockComponent block={block} isEditing={isEditing} onUpdate={onUpdate} />;

        case 'slider':
            // @ts-ignore
            return <SliderBlockComponent block={block} isEditing={isEditing} onUpdate={onUpdate} />;

        case 'video':
            return <VideoBlockComponent block={block} isEditing={isEditing} onUpdate={onUpdate} />;

        case 'image-grid':
            return <ImageGridBlockComponent block={block} isEditing={isEditing} onUpdate={onUpdate} />;


        default:
            return <div className="p-4 bg-red-50 text-red-500">Bilinmeyen blok tipi: {(block as any).type}</div>;
    }
}
