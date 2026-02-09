import { HeroBlock } from "@/types/page-builder";
import Image from "next/image";
import { InlineText } from "../InlineText";

interface HeroSectionProps {
    block: HeroBlock;
    isEditing?: boolean;
    onUpdate?: (newData: any) => void;
    pageSlug?: string;
    stageNumber?: number;
}

export function HeroSection({ block, isEditing = false, onUpdate, pageSlug, stageNumber }: HeroSectionProps) {
    console.log('HeroSection: stageNumber prop:', stageNumber);
    const { title, description, backgroundImage } = block.data;

    const handleUpdate = (key: string, value: string) => {
        if (onUpdate) {
            onUpdate({ ...block.data, [key]: value });
        }
    };

    // Logic to automatically handle "1. Aşama: Title" pattern (Priority 2)
    const titleMatch = title.match(/^(\d+)\.\s*Aşama:\s*(.+)$/i);

    // Logic to derive stage from page slug (Priority 1)
    const getStageNumber = () => {
        // Priority 1: Explicitly passed stage number (from DB sequence)
        if (stageNumber !== undefined && stageNumber !== null) {
            return stageNumber.toString();
        }

        if (pageSlug) {
            // If slug is numeric "1", "2"
            if (/^\d+$/.test(pageSlug)) return pageSlug;

            // If slug is like "stage-1"
            const slugMatch = pageSlug.match(/(\d+)/);
            if (slugMatch) return slugMatch[1];

            // Specific mapping for common slugs
            if (pageSlug === 'on-teklif') return "1";
        }

        // Priority 2: Explicit in title
        if (titleMatch) return titleMatch[1];

        // Priority 3: Default
        return "1";
    };

    const displayStageNumber = getStageNumber();
    const displayBadge = `${displayStageNumber}. AŞAMA`;
    const displayTitle = titleMatch ? titleMatch[2] : title;

    return (
        <section className="relative w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
            {/* Main Container - Standardized minimal spacing */}
            <div className="container mx-auto px-4 pt-4 pb-2 md:pt-6 md:pb-4">
                <div className="max-w-7xl mx-auto">

                    {/* 1. Header Area (Outside Card) */}
                    <div className="mb-3 md:mb-5">
                        {/* Badge - AUTOMATIC (Not Editable) */}
                        <div className="flex items-center gap-3 mb-1.5">
                            <span className="w-10 h-1 bg-[#ed2630] rounded-full"></span>
                            <span className="text-xs font-bold tracking-widest text-[#ed2630] uppercase">
                                {displayBadge}
                            </span>
                        </div>

                        {/* Title */}
                        {isEditing ? (
                            <div
                                onClick={() => {
                                    if (title === 'Başlık Buraya' && onUpdate) {
                                        onUpdate({ ...block.data, title: '' });
                                    }
                                }}
                                className={title === 'Başlık Buraya' ? 'opacity-50' : ''}
                            >
                                <InlineText
                                    value={title}
                                    onSave={(val) => handleUpdate('title', val)}
                                    tagName="h1"
                                    className="text-3xl md:text-5xl font-black text-[#1a1b1f] dark:text-white leading-tight tracking-tight min-h-[1.2em] outline-none"
                                />
                            </div>
                        ) : (
                            <h1 className="text-3xl md:text-5xl font-black text-[#1a1b1f] dark:text-white leading-tight tracking-tight">
                                {displayTitle}
                            </h1>
                        )}
                    </div>

                    {/* 2. White Card (Description Only) */}
                    <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden">
                        {/* Background Image if exists */}
                        {backgroundImage && (
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={backgroundImage}
                                    alt={title}
                                    fill
                                    className="object-cover opacity-10"
                                    priority
                                />
                            </div>
                        )}

                        <div className="relative z-10 px-8 py-10 md:px-12 md:py-14">
                            {/* Description */}
                            {isEditing ? (
                                <div
                                    onClick={() => {
                                        const defaultDesc = 'Açıklama metni buraya gelecek. Kentsel dönüşüm süreci hakkında bilgi verin.';
                                        if ((!description || description === defaultDesc) && onUpdate) {
                                            onUpdate({ ...block.data, description: '' });
                                        }
                                    }}
                                    className={(!description || description === 'Açıklama metni buraya gelecek. Kentsel dönüşüm süreci hakkında bilgi verin.') ? 'opacity-50' : ''}
                                >
                                    <InlineText
                                        value={description || 'Açıklama metni buraya gelecek. Kentsel dönüşüm süreci hakkında bilgi verin.'}
                                        onSave={(val) => handleUpdate('description', val)}
                                        tagName="p"
                                        className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed min-h-[1.5em] outline-none"
                                    />
                                </div>
                            ) : (
                                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
