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

export function DynamicStageCard({ stageId }: { stageId: number }) {
    const [post, setPost] = useState<PostData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Debounce the fetch to avoid spamming while spinning the wheel
    const debouncedStageId = useDebounce(stageId, 500);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
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

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [debouncedStageId]);

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

            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <RichTextRenderer content={post.content} />
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
