"use client";

import { Plus, ChatCircleDots, ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

interface BuilderSidebarProps {
    onAddStage: () => void;
    onAddPost: (type: 'ANNOUNCEMENT' | 'MEETING' | 'SURVEY') => void;
    onAddContent?: (type: 'heading' | 'text' | 'image' | 'pdf' | 'gallery' | 'divider') => void;
    isDesignMode?: boolean;
    onDesignModeChange?: (isDesign: boolean) => void;
}

export function BuilderSidebar({
    onAddStage,
    onAddPost,
    // onAddContent and others are kept for partial compatibility but not used in UI
}: BuilderSidebarProps) {

    return (
        <aside className="hidden lg:flex flex-col w-80 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 overflow-y-auto z-[50]">
            <div className="p-6 flex flex-col gap-6">

                {/* Header / Back Button */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <Link href="/admin" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 hover:bg-[#ed2630]/10 text-slate-500 hover:text-[#ed2630] transition-colors">
                        <ArrowLeft weight="bold" className="w-5 h-5" />
                    </Link>
                    <span className="font-bold text-slate-800 text-lg">İçerik Yönetimi</span>
                </div>

                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    {/* Section: Süreç Yapısı */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1 h-4 bg-[#ed2630] rounded-full"></span>
                            Süreç Yönetimi
                        </h3>
                        <button
                            onClick={onAddStage}
                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-[#ed2630] hover:bg-[#ed2630]/5 hover:shadow-md transition-all group text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#ed2630] transition-colors">
                                <Plus weight="bold" className="w-5 h-5 text-slate-600 group-hover:text-white" />
                            </div>
                            <div>
                                <span className="block font-bold text-slate-700 group-hover:text-[#ed2630]">Yeni Aşama Ekle</span>
                                <span className="text-xs text-slate-500">Timeline'a yeni bir adım ekle</span>
                            </div>
                        </button>
                    </div>

                    {/* Section: Ekstra Modüller */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                            Etkileşim Araçları
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => onAddPost('MEETING')}
                                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm transition-all group text-left"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                </div>
                                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Toplantı Planla</span>
                            </button>

                            <button
                                onClick={() => onAddPost('ANNOUNCEMENT')}
                                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm transition-all group text-left"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                                </div>
                                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Etkinlik Duyurusu</span>
                            </button>

                            <button
                                onClick={() => onAddPost('SURVEY')}
                                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm transition-all group text-left"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                                    <ChatCircleDots className="w-4 h-4 text-orange-500" />
                                </div>
                                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Anket Oluştur</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50">
                <div className="text-xs text-slate-400 font-medium text-center">
                    Murat Sitesi Yönetim Paneli
                </div>
            </div>
        </aside>
    );
}
