"use client";

import { motion } from "framer-motion";

interface MobilePreviewProps {
    title: string;
    content: string;
}

export function MobilePreview({ title, content }: MobilePreviewProps) {
    return (
        <div className="sticky top-6">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-sm">smartphone</span>
                </div>
                <h3 className="font-semibold text-slate-900">Canlı Önizleme</h3>
            </div>

            {/* Premium White Phone Frame */}
            <div className="relative mx-auto">
                {/* Outer Frame (Shadow & Depth) */}
                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-slate-200 via-slate-100 to-white transform translate-y-4 scale-[1.02] blur-xl opacity-50"></div>

                {/* Main Device Body */}
                <div className="relative bg-white border-[8px] border-slate-100 outline outline-1 outline-slate-200 rounded-[3rem] h-[640px] w-full max-w-[320px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15),inset_0_0_0_2px_rgba(255,255,255,1)]">

                    {/* Notch/Dynamic Island Area */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-slate-900 rounded-b-2xl z-30 flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                        <div className="w-8 h-1.5 rounded-full bg-slate-800"></div>
                    </div>

                    {/* Side Buttons */}
                    <div className="absolute -left-[10px] top-28 h-10 w-[4px] bg-slate-200 rounded-l-md shadow-sm"></div>
                    <div className="absolute -left-[10px] top-40 h-16 w-[4px] bg-slate-200 rounded-l-md shadow-sm"></div>
                    <div className="absolute -right-[10px] top-32 h-20 w-[4px] bg-slate-200 rounded-r-md shadow-sm"></div>

                    {/* Inner Screen Area */}
                    <div className="h-full w-full bg-slate-50 rounded-[2.5rem] overflow-hidden relative border-[3px] border-black/5">

                        {/* Status Bar - Removed as requested */}


                        {/* App Header (Clean White Premium) */}
                        <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 pt-14 pb-4 px-4 sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <button className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
                                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                                </button>
                                <span className="font-bold text-slate-800 text-sm">Duyuru Detayı</span>
                                <div className="ml-auto flex gap-2">
                                    <button className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                                        <span className="material-symbols-outlined text-sm">share</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="p-5 overflow-y-auto h-[calc(100%-90px)] no-scrollbar">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100/60"
                            >
                                {/* Category Verification Badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wide border border-red-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                        Duyuru
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-400">
                                        Henüz yayınlanmadı
                                    </span>
                                </div>

                                {/* Title */}
                                <div className="min-h-[2rem] mb-4">
                                    {title ? (
                                        <h1 className="text-xl font-bold text-slate-900 leading-tight">
                                            {title}
                                        </h1>
                                    ) : (
                                        <div className="space-y-2 animate-pulse">
                                            <div className="h-6 w-3/4 bg-slate-100 rounded-lg"></div>
                                            <div className="h-6 w-1/2 bg-slate-100 rounded-lg"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-100 to-transparent my-4"></div>

                                {/* Content */}
                                <div className="min-h-[10rem]">
                                    {content ? (
                                        <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed text-sm">
                                            <p className="whitespace-pre-wrap">{content}</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 animate-pulse">
                                            <div className="h-3 w-full bg-slate-50 rounded"></div>
                                            <div className="h-3 w-5/6 bg-slate-50 rounded"></div>
                                            <div className="h-3 w-4/6 bg-slate-50 rounded"></div>
                                            <div className="h-3 w-full bg-slate-50 rounded"></div>
                                            <div className="h-3 w-3/4 bg-slate-50 rounded"></div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Bottom Context Info */}
                            <div className="mt-6 flex flex-col gap-3">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">Yönetim Tarafından</p>
                                            <p className="text-[10px] text-slate-500">Tüm sakinler görebilir</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Navigation Bar Mockup */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-slate-300 rounded-full z-20"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
