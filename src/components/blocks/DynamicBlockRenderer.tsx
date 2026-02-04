import { BlockData } from "@/lib/validations/blocks";
import { HeroBlock } from "./HeroBlock";
import { RichTextBlock } from "./RichTextBlock";
import { ImageBlock } from "./ImageBlock";
import { PdfBlock } from "./PdfBlock";
import { AnnouncementBlock } from "./AnnouncementBlock";
import { InfoCardsBlock } from "./InfoCardsBlock";
import { SurveyBlock } from "./SurveyBlock";
import { cn } from "@/lib/utils";

interface DynamicBlockRendererProps {
    blocks: any[]; // Should be parsed BlockData[]
}

export function DynamicBlockRenderer({ blocks }: DynamicBlockRendererProps) {
    let parsedBlocks = blocks;

    if (typeof blocks === 'string') {
        try {
            parsedBlocks = JSON.parse(blocks);
        } catch (e) {
            console.error("Failed to parse blocks:", e);
            return null;
        }
    }

    if (!parsedBlocks || !Array.isArray(parsedBlocks)) return null;

    return (
        <div className="w-full space-y-0 relative">
            {parsedBlocks.map((block: any, index: number) => {
                const { type, data } = block;
                const id = data.anchorId || `block-${index}`;

                return (
                    <section
                        key={id}
                        id={id}
                        className={cn(
                            "w-full transition-all duration-300",
                            data.visibility === "hidden" && "hidden",
                            data.spacing === "none" && "py-0",
                            data.spacing === "small" && "py-1.5 md:py-2",
                            data.spacing === "medium" && "py-3 md:py-4",
                            data.spacing === "large" && "py-5 md:py-8"
                        )}
                    >
                        {type === "hero" && <HeroBlock data={data} />}
                        {type === "richtext" && <RichTextBlock data={data} />}
                        {type === "image" && <ImageBlock data={data} />}
                        {type === "pdf" && <PdfBlock data={data} />}
                        {type === "announcement" && <AnnouncementBlock data={data} />}
                        {type === "infocards" && <InfoCardsBlock data={data} />}
                        {type === "survey" && <SurveyBlock data={data} />}
                    </section>
                );
            })}
        </div>
    );
}
