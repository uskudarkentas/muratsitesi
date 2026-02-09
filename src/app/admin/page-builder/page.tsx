"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageBuilderLayout } from "@/components/page-builder/PageBuilderLayout";
import { PageSelector } from "@/components/page-builder/PageSelector";
import { getPageContent, savePageContent } from "@/server/actions/pageBuilderActions";
import { ContentBlock } from "@/types/page-builder";
import Link from "next/link";

export default function PageBuilderPage() {
    const router = useRouter();
    const [selectedSlug, setSelectedSlug] = useState("on-teklif");
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stageOrder, setStageOrder] = useState<number | undefined>(undefined);

    // Load page content when slug changes
    useEffect(() => {
        loadPageContent(selectedSlug);
    }, [selectedSlug]);

    const loadPageContent = async (slug: string) => {
        setIsLoading(true);
        try {
            const result = await getPageContent(slug);
            if (result.success && result.data) {
                console.log('PageBuilderPage: stageOrder from action:', result.data.stageOrder);
                setBlocks(result.data.blocks);
                // @ts-ignore - stageOrder exists in the response now
                setStageOrder(result.data.stageOrder);
            } else {
                // Page doesn't exist yet, start with empty blocks
                setBlocks([]);
                setStageOrder(undefined);
            }
        } catch (error) {
            console.error("Error loading page content:", error);
            setBlocks([]);
            setStageOrder(undefined);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (updatedBlocks: ContentBlock[]) => {
        console.log("CLIENT DEBUG: handleSave called for slug:", selectedSlug);
        console.log("CLIENT DEBUG: blocks to save:", updatedBlocks);

        try {
            const result = await savePageContent(selectedSlug, updatedBlocks);
            console.log("CLIENT DEBUG: Server response:", result);

            if (!result.success) {
                console.error("CLIENT DEBUG: Save failed with error:", result.error);
                throw new Error(result.error || "Kaydetme başarısız");
            } else {
                console.log("CLIENT DEBUG: Save successful!");
            }
        } catch (error) {
            console.error("CLIENT DEBUG: Exception in handleSave:", error);
            throw error;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined !text-6xl text-[#ed2630] animate-spin">
                        progress_activity
                    </span>
                    <p className="text-lg font-semibold text-[#46474A] dark:text-white">
                        Sayfa yükleniyor...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            {/* Page Builder */}
            <div className="flex-1 overflow-hidden">
                <PageBuilderLayout
                    key={selectedSlug} // Force re-render when slug changes
                    initialBlocks={blocks}
                    onSave={handleSave}
                    pageSlug={selectedSlug}
                    stageNumber={stageOrder}
                    headerContent={
                        <div className="w-80">
                            <PageSelector
                                selectedSlug={selectedSlug}
                                onSelectPage={setSelectedSlug}
                            />
                        </div>
                    }
                />
            </div>
        </div>
    );
}
