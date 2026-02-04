"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';

// Helper for image download
const downloadImage = async (url: string, filename: string) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename || 'gorsel-indir';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Download failed:', error);
    }
};

// Helper for image sharing
const shareImage = async (data: { title: string, text: string, url: string }) => {
    if (navigator.share) {
        try {
            await navigator.share(data);
        } catch (error) {
            console.error('Share failed:', error);
        }
    } else {
        // Fallback: Copy link
        navigator.clipboard.writeText(data.url);
        alert('Bağlantı kopyalandı!');
    }
};

interface Block {
    id: string;
    type: string;
    data: any;
}

interface RichTextRendererProps {
    content: any; // Editor.js output object { time, blocks: [], version }
    className?: string;
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
    if (!content || !content.blocks) return null;

    return (
        <div className={cn("prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-4", className)}>
            {content.blocks.map((block: Block) => {
                switch (block.type) {
                    case 'header':
                        const Level = `h${block.data.level}` as keyof JSX.IntrinsicElements;
                        return (
                            <Level key={block.id} className="font-bold text-gray-800 dark:text-gray-100 mt-6 mb-2">
                                {block.data.text}
                            </Level>
                        );

                    case 'paragraph':
                        return (
                            <p
                                key={block.id}
                                className="text-gray-600 dark:text-gray-300 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: block.data.text }}
                            ></p>
                        );

                    case 'list':
                        const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
                        return (
                            <ListTag key={block.id} className="pl-5 space-y-1">
                                {block.data.items.map((item: string, i: number) => (
                                    <li
                                        key={i}
                                        dangerouslySetInnerHTML={{ __html: item }}
                                        className="marker:text-primary"
                                    ></li>
                                ))}
                            </ListTag>
                        );

                    case 'image':
                        return (
                            <div key={block.id} className="my-6">
                                <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-md">
                                    <Image
                                        src={block.data.file.url}
                                        alt={block.data.caption || "İçerik görseli"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    {block.data.caption && (
                                        <p className="text-sm text-gray-500 italic">
                                            {block.data.caption}
                                        </p>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => downloadImage(block.data.file.url, 'gorsel.jpg')}
                                            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                            title="İndir"
                                            aria-label="Görseli İndir"
                                        >
                                            <span className="material-symbols-outlined !text-[20px]">download</span>
                                        </button>
                                        <button
                                            onClick={() => shareImage({
                                                title: 'Görsel Paylaş',
                                                text: block.data.caption,
                                                url: block.data.file.url
                                            })}
                                            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                            title="Paylaş"
                                            aria-label="Görseli Paylaş"
                                        >
                                            <span className="material-symbols-outlined !text-[20px]">share</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'delimiter':
                        return <hr key={block.id} className="my-8 border-gray-200 dark:border-gray-700" />;

                    default:
                        return null;
                }
            })}
        </div>
    );
}
