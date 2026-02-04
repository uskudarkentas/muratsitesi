"use client";

import { cn } from "@/lib/utils";
import { FilePdf, ArrowDown } from "@phosphor-icons/react";

interface Block {
    id: string;
    type: 'heading' | 'text' | 'image' | 'pdf' | 'gallery' | 'divider';
    value: string;
    level?: 1 | 2 | 3;
    fileName?: string;
    images?: string[];
    galleryStyle?: 'grid' | 'slider';
}

interface PageRendererProps {
    content: any;
}

export function PageRenderer({ content }: PageRendererProps) {
    let blocks: Block[] = [];

    try {
        if (typeof content === 'string') {
            blocks = JSON.parse(content);
        } else if (Array.isArray(content)) {
            blocks = content;
        }
    } catch (e) {
        console.error('Failed to parse page content:', e);
        return null;
    }

    if (!blocks || blocks.length === 0) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {blocks.map((block) => (
                <div key={block.id} className="w-full">
                    {block.type === 'heading' && (
                        <div className={cn(
                            "text-foreground font-bold",
                            block.level === 1 ? "text-4xl md:text-5xl mb-6" :
                                block.level === 2 ? "text-2xl md:text-3xl mb-4" : "text-xl mb-3"
                        )}>
                            {block.value}
                        </div>
                    )}

                    {block.type === 'text' && (
                        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {block.value}
                        </p>
                    )}

                    {block.type === 'image' && block.value && (
                        <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-sm">
                            <img
                                src={block.value}
                                alt="Page Content"
                                className="w-full h-auto object-contain max-h-[800px]"
                            />
                        </div>
                    )}

                    {block.type === 'pdf' && block.value && (
                        <a
                            href={block.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group"
                        >
                            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FilePdf size={32} weight="bold" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="block font-bold text-foreground text-lg truncate">
                                    {block.fileName || "Dokümanı Görüntüle"}
                                </span>
                                <span className="text-sm text-muted-foreground">PDF Belgesi • İndirmek için tıklayın</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                                <ArrowDown size={20} weight="bold" />
                            </div>
                        </a>
                    )}

                    {block.type === 'gallery' && block.images && block.images.length > 0 && (
                        <div className="w-full">
                            {block.galleryStyle === 'slider' ? (
                                <div className="relative group/slider">
                                    <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
                                        {block.images.map((url, i) => (
                                            <div
                                                key={i}
                                                className="min-w-[85%] md:min-w-[60%] aspect-[16/10] snap-center rounded-3xl overflow-hidden border border-border bg-card shadow-sm"
                                            >
                                                <img src={url} alt={`Slide ${i}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-center gap-2 mt-2">
                                        {block.images.map((_, i) => (
                                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {block.images.map((url, i) => (
                                        <div
                                            key={i}
                                            className="aspect-square rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg transition-all"
                                        >
                                            <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {block.type === 'divider' && (
                        <div className="py-8 flex justify-center">
                            <div className={cn(
                                "w-full border-t-2",
                                block.value === 'dashed' ? "border-dashed border-border/50" : "border-solid border-border/30"
                            )} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
