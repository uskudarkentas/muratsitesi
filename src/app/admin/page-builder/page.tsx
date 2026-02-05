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
    const [selectedSlug, setSelectedSlug] = useState("home");
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load page content when slug changes
    useEffect(() => {
        loadPageContent(selectedSlug);
    }, [selectedSlug]);

    const loadPageContent = async (slug: string) => {
        setIsLoading(true);
        try {
            const result = await getPageContent(slug);
            if (result.success && result.data) {
                setBlocks(result.data.blocks);
            } else {
                // Page doesn't exist yet, start with empty blocks
                setBlocks([]);
            }
        } catch (error) {
            console.error("Error loading page content:", error);
            setBlocks([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (updatedBlocks: ContentBlock[]) => {
        const result = await savePageContent(selectedSlug, updatedBlocks);
        if (!result.success) {
            throw new Error(result.error || "Kaydetme başarısız");
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
            {/* Top Navigation */}
            <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    {/* Back Button */}
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#ed2630] transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="font-medium">Admin Paneli</span>
                    </Link>

                    {/* Page Selector */}
                    <div className="w-80">
                        <PageSelector
                            selectedSlug={selectedSlug}
                            onSelectPage={setSelectedSlug}
                        />
                    </div>

                    {/* Preview Button */}
                    <Link
                        href={`/${selectedSlug}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-[#46474A] dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <span className="material-symbols-outlined">visibility</span>
                        <span className="font-medium">Önizle</span>
                    </Link>
                </div>
            </div>

            {/* Page Builder */}
            <div className="flex-1 overflow-hidden">
                <PageBuilderLayout
                    key={selectedSlug} // Force re-render when slug changes
                    initialBlocks={blocks}
                    onSave={handleSave}
                    pageSlug={selectedSlug}
                />
            </div>
        </div>
    );
}
