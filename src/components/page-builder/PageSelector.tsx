"use client";

import { useState, useEffect } from "react";
import { getAllPages } from "@/server/actions/pageBuilderActions";

interface PageOption {
    slug: string;
    label: string;
    description?: string;
}

interface PageSelectorProps {
    selectedSlug: string;
    onSelectPage: (slug: string) => void;
}

export function PageSelector({ selectedSlug, onSelectPage }: PageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [pages, setPages] = useState<PageOption[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPages() {
            try {
                const result = await getAllPages();
                if (result.success && result.data) {
                    // Type assertion since we know the structure matches but TS might infer strictly
                    setPages(result.data as PageOption[]);
                }
            } catch (error) {
                console.error("Sayfalar yüklenemedi:", error);
            } finally {
                setLoading(false);
            }
        }
        loadPages();
    }, []);

    const selectedPage = pages.find((p) => p.slug === selectedSlug) || {
        slug: selectedSlug,
        label: selectedSlug,
        description: 'Yükleniyor...'
    };

    return (
        <div className="relative">
            {/* Selected Page Display */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={loading}
                className="flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-[#ed2630] transition-all disabled:opacity-50"
            >
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
                        {loading ? 'hourglass_empty' : 'web'}
                    </span>
                    <div className="text-left">
                        <p className="text-sm font-bold text-[#46474A] dark:text-white truncate max-w-[180px]">
                            {selectedPage.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                            {selectedPage.description}
                        </p>
                    </div>
                </div>
                <span className={`material-symbols-outlined transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Options */}
                    <div className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20">
                        {/* List only Dynamic Stages */}
                        {pages.filter(p => !['home', 'contact', 'risk-notice'].includes(p.slug)).map((page) => (
                            <button
                                key={page.slug}
                                onClick={() => {
                                    onSelectPage(page.slug);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left ${selectedSlug === page.slug ? 'bg-[#ed2630]/5 border-l-4 border-[#ed2630]' : ''
                                    }`}
                            >
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-[#46474A] dark:text-white">
                                        {page.label}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
