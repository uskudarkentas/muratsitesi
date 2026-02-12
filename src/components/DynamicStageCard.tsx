"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTimelineContext } from "@/context/TimelineContext";
import { getLatestStagePost } from "@/actions/timeline";
import { RichTextRenderer } from "@/components/RichTextRenderer";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface PostData {
    id: string;
    title: string;
    content: any;
    type: "ANNOUNCEMENT" | "MEETING" | "SURVEY";
    publishedAt: Date | null;
    imageUrl?: string | null;
    attachmentUrl?: string | null;
}

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export function DynamicStageCard({ stageId, initialPost }: { stageId: number; initialPost?: any }) {
    const [post, setPost] = useState<PostData | null>(initialPost || null);
    const [isLoading, setIsLoading] = useState(!initialPost);

    // Debounce the fetch to avoid spamming while spinning the wheel
    const debouncedStageId = useDebounce(stageId, 500);

    // Update state if initialPost changes (e.g. parent updates)
    useEffect(() => {
        if (initialPost) {
            setPost(initialPost);
            setIsLoading(false);
        }
    }, [initialPost]);

    useEffect(() => {
        // If we have an initial post and it matches the stageId, we might not need to fetch immediately
        // But stageId prop might change while scrolling. 

        // If initialPost is present and matches the current stage context, skip fetch? 
        // Simpler: Just fetch if no post or if stageId changed and we don't have *that* stage's post.
        // For now, let's allow fetching to ensure fresh data on stage change, 
        // unless initialPost is provided AND matches the *debounced* stageId context (which is hard to know without ID check).

        // Strategy: If `initialPost` is passed, we rely on it. If stageId changes, 
        // the parent *should* pass the new initialPost. 
        // However, DynamicStageCard is often used in a context where stageId changes rapidly (scrolling).

        // If we are functioning as a "Static" card driven by parent (TimelineItem), 
        // we might not even need the internal fetch logic if `initialPost` is always provided.
        // But for backward compatibility with other usages, we keep the fetch.

        if (initialPost && post?.id === initialPost.id) return; // Skip if we already have it from props

        let isMounted = true;

        async function fetchData() {
            // Only fetch if we don't have valid data for this stageId
            // OR if we want to support dynamic updates.
            setIsLoading(true);
            try {
                const data = await getLatestStagePost(debouncedStageId);
                if (isMounted) {
                    setPost(data as any);
                }
            } catch (error) {
                console.error("Failed to fetch stage post", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        if (!initialPost) {
            fetchData();
        }

        return () => {
            isMounted = false;
        };
    }, [debouncedStageId, initialPost]);

    if (isLoading) {
        return <StageCardSkeleton />;
    }

    if (!post) {
        return (
            <div className="text-left py-8">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Duyuru Bulunmuyor
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Bu aşama hakkında henüz güncel bir duyuru bulunmamaktadır.
                </p>
            </div>
        );
    }

    const TYPE_CONFIG = {
        ANNOUNCEMENT: { label: 'Duyuru', color: 'text-purple-500 bg-purple-50' },
        MEETING: { label: 'Toplantı', color: 'text-blue-500 bg-blue-50' },
        SURVEY: { label: 'Anket', color: 'text-orange-500 bg-orange-50' }
    };

    const config = TYPE_CONFIG[post.type] || TYPE_CONFIG.ANNOUNCEMENT;

    // Normalize content for RichTextRenderer
    // The DB might contain raw text (from simple form) or JSON string (from editor)
    // We also need to inject the `imageUrl` as an image block if it exists
    const getNormalizedContent = () => {
        let blocks: any[] = [];
        const rawContent = post.content;
        const postId = post.id; // Use post ID to namespace static blocks

        // 1. Add Image Block if imageUrl exists
        if (post.imageUrl) {
            blocks.push({
                id: `main-image-${postId}`,
                type: 'image',
                data: {
                    file: { url: post.imageUrl },
                    caption: '', // Could use title?
                    withBorder: false,
                    withBackground: false,
                    stretched: false
                }
            });
        }

        // 2. Add Content
        if (rawContent) {
            try {
                // Try to parse as JSON (Editor.js output)
                const parsed = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

                if (parsed && Array.isArray(parsed.blocks)) {
                    // Ensure every block has an ID and avoid collisions
                    const parsedBlocks = parsed.blocks.map((b: any, index: number) => ({
                        ...b,
                        id: b.id || `block-${postId}-${index}`
                    }));
                    blocks = [...blocks, ...parsedBlocks];
                } else if (typeof parsed === 'object' && parsed.blocks && Array.isArray(parsed.blocks)) {
                    // Handle { time, blocks, version } structure
                    const parsedBlocks = parsed.blocks.map((b: any, index: number) => ({
                        ...b,
                        id: b.id || `block-${postId}-${index}`
                    }));
                    blocks = [...blocks, ...parsedBlocks];
                } else {
                    // Not a block structure, treat as plain text
                    throw new Error("Not a block structure");
                }
            } catch (e) {
                // Determine if it was a JSON parse error or our custom error
                // If parse error or "Not a block structure", treat as plain text paragraph
                blocks.push({
                    id: `main-text-${postId}`,
                    type: 'paragraph',
                    data: {
                        text: String(rawContent).replace(/\n/g, '<br/>') // Basic formatting
                    }
                });
            }
        }

        return { blocks };
    };

    const normalizedContent = getNormalizedContent();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
            <div className="mb-4">
                <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border",
                    config.color,
                    config.color.split(' ')[0].replace('text-', 'border-').replace('500', '100')
                )}>
                    {config.label}
                </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {post.title}
            </h3>

            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <span className="material-symbols-outlined !text-[16px]">calendar_today</span>
                <span>
                    {post.publishedAt ? format(new Date(post.publishedAt), 'd MMMM yyyy', { locale: tr }) : ''}
                </span>
            </div>

            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <RichTextRenderer content={normalizedContent} />
            </div>
        </div>
    );
}

function StageCardSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="space-y-2 mt-6">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
        </div>
    );
}
