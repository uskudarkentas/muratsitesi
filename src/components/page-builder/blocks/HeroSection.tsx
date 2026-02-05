import { HeroBlock } from "@/types/page-builder";
import Image from "next/image";
import { InlineText } from "../InlineText";

interface HeroSectionProps {
    block: HeroBlock;
    isEditing?: boolean;
    onUpdate?: (newData: any) => void;
}

export function HeroSection({ block, isEditing = false, onUpdate }: HeroSectionProps) {
    const { title, description, backgroundImage } = block.data;

    const handleUpdate = (key: string, value: string) => {
        if (onUpdate) {
            onUpdate({ ...block.data, [key]: value });
        }
    };

    return (
        <section className="relative w-full overflow-hidden py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 p-8 md:p-16 max-w-5xl mx-auto text-center overflow-hidden">
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

                    <div className="relative z-10 flex flex-col items-start text-left">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-1 bg-[#ed2630] rounded-full"></span>
                            <span className="text-sm font-bold tracking-widest text-[#ed2630] uppercase">1. AŞAMA</span>
                        </div>

                        {isEditing ? (
                            <InlineText
                                value={title}
                                onSave={(val) => handleUpdate('title', val)}
                                tagName="h1"
                                className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1b1f] dark:text-white mb-8 tracking-tight"
                            />
                        ) : (
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1b1f] dark:text-white mb-8 tracking-tight">
                                {title}
                            </h1>
                        )}

                        {isEditing ? (
                            <InlineText
                                value={description}
                                onSave={(val) => handleUpdate('description', val)}
                                tagName="p"
                                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl"
                            />
                        ) : (
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                                {description}
                            </p>
                        )}

                        {/* Button completely removed per user request */}
                    </div>
                </div>
            </div>
        </section>
    );
}
