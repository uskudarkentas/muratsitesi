"use client";

import { DocumentPreviewBlock } from "@/types/page-builder";
import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { MagnifyingGlassPlus, FileText } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { RichText } from "../RichText";
import { InlineText } from "../InlineText";

interface DocumentPreviewBlockProps {
    block: DocumentPreviewBlock;
    isEditing?: boolean;
    onUpdate?: (newData: any) => void;
}

export function DocumentPreviewBlockComponent({ block, isEditing = false, onUpdate }: DocumentPreviewBlockProps) {
    const { url, title, description, buttonText = "Belgeyi İncele" } = block.data;
    const [isOpen, setIsOpen] = useState(false);

    const handleUpdate = (key: string, value: string) => {
        if (onUpdate) {
            onUpdate({ ...block.data, [key]: value });
        }
    };

    return (
        <section className="w-full bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 pt-2 pb-2 md:pt-4 md:pb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">

                        {/* Horizontal Split Card */}
                        <div className="flex flex-col md:flex-row bg-white dark:bg-slate-900 overflow-hidden">

                            {/* Left: Thumbnail (A4 Vertical Ratio) */}
                            <div
                                className="relative w-full md:w-[350px] h-[450px] md:h-[500px] overflow-hidden cursor-zoom-in flex-shrink-0 bg-slate-100"
                                onClick={() => setIsOpen(true)}
                            >
                                <Image
                                    src={url}
                                    alt={title}
                                    fill
                                    className="object-cover object-top transition-transform duration-700 "
                                    unoptimized={true}
                                />

                                {/* Hover Overlay for image */}
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-500" />

                                <div className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg text-[#ed2630]">
                                    <MagnifyingGlassPlus size={24} weight="bold" />
                                </div>
                            </div>

                            {/* Right: Content */}
                            <div className="flex-1 p-8 md:p-14 flex flex-col justify-center bg-gradient-to-br from-white via-white to-slate-50/30">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-[#ed2630]">
                                        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center">
                                            <FileText size={28} weight="fill" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Belge Özeti</span>
                                    </div>

                                    <div onClick={(e) => e.stopPropagation()}>
                                        {isEditing ? (
                                            <RichText
                                                value={title}
                                                onSave={(val) => handleUpdate('title', val)}
                                                className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-4 tracking-tight"
                                                placeholder="Doküman Başlığı"
                                            />
                                        ) : (
                                            <h3
                                                className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-4 tracking-tight"
                                                dangerouslySetInnerHTML={{ __html: title }}
                                            />
                                        )}

                                        {isEditing ? (
                                            <RichText
                                                value={description || ""}
                                                onSave={(val) => handleUpdate('description', val)}
                                                className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed"
                                                placeholder="Doküman açıklaması..."
                                            />
                                        ) : (
                                            description && (
                                                <div
                                                    className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed prose prose-lg dark:prose-invert max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: description }}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="mt-10">
                                    {isEditing ? (
                                        <div className="w-fit" onClick={(e) => e.stopPropagation()}>
                                            <InlineText
                                                value={buttonText}
                                                onSave={(val) => handleUpdate('buttonText', val)}
                                                className="inline-flex items-center gap-4 px-10 py-5 bg-[#ed2630] text-white font-bold rounded-2xl hover:bg-[#d11f2a] transition-all shadow-xl text-lg uppercase tracking-wider"
                                                placeholder="Buton Metni"
                                            />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsOpen(true)}
                                            className="w-fit flex items-center gap-4 px-10 py-5 bg-[#ed2630] text-white font-bold rounded-2xl hover:bg-[#d11f2a] transition-all shadow-xl hover:shadow-2xl active:scale-95 group/btn text-lg uppercase tracking-wider"
                                        >
                                            <MagnifyingGlassPlus size={24} weight="bold" className="group-hover/btn:rotate-12 transition-transform" />
                                            {buttonText}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <Lightbox
                open={isOpen}
                close={() => setIsOpen(false)}
                slides={[{ src: url }]}
                plugins={[Zoom]}
                zoom={{
                    maxZoomPixelRatio: 3,
                    zoomInMultiplier: 2,
                    doubleTapDelay: 300,
                    doubleClickDelay: 300,
                }}
                styles={{
                    container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
                }}
            />
        </section>
    );
}
