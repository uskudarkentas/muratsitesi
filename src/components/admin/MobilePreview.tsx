"use client";

import { Calendar } from "@phosphor-icons/react";

interface MobilePreviewProps {
    title: string;
    content: string;
}

export function MobilePreview({ title, content }: MobilePreviewProps) {
    // Format today's date in Turkish format: "30 Ocak 2026"
    const today = new Date();
    const formattedDate = today.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="flex flex-col items-center justify-start h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8">
            {/* Preview Header */}
            <div className="text-center mb-6">
                <p className="text-xs font-semibold tracking-tight text-slate-700 mb-1">
                    Mobil Önizleme
                </p>
                <p className="text-xs text-slate-500">
                    Kullanıcıların göreceği görünüm
                </p>
            </div>

            {/* iPhone 16 Pro Style Frame - Bezel-less */}
            <div className="relative w-full max-w-[280px]">
                {/* Device Frame - Ultra-thin 1px border, bezel-less */}
                <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-[3rem] shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-300/20 overflow-hidden">
                    {/* Dynamic Island (subtle pill shape at top) */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-slate-900/90 rounded-full z-20 backdrop-blur-sm"></div>

                    {/* Screen Content */}
                    <div className="relative pt-12 pb-6 px-4 h-[540px] overflow-y-auto bg-slate-50">
                        {/* New Announcement Card Implementation (Green Border Style) */}
                        <div className="bg-white rounded-xl border border-green-500 shadow-sm p-4 mt-6">
                            {/* Header: Badge and Date */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="bg-pink-100 text-pink-600 text-[10px] font-bold px-2 py-1 rounded inline-block">
                                    EN GÜNCEL DUYURU
                                </span>
                                <div className="flex items-center gap-1 text-gray-500 text-xs font-medium">
                                    <Calendar weight="fill" className="w-3.5 h-3.5 text-gray-400" />
                                    <span>{formattedDate}</span>
                                </div>
                            </div>

                            {/* Dynamic Title */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                                {title || "Duyuru Başlığı"}
                            </h3>

                            {/* Dynamic Content */}
                            <div className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                                {content || "Duyuru içeriğini buraya yazın..."}
                            </div>

                            {/* Static Button Placeholder */}
                            <button className="w-full bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg mt-5 hover:bg-green-800 transition-colors pointer-events-none shadow-sm flex items-center justify-center gap-2">
                                Tüm Detayları Gör
                            </button>
                        </div>
                    </div>
                </div>

                {/* Subtle reflection effect */}
                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
}
