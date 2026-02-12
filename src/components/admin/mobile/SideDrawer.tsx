"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Gear, User, SignOut, Question, ChartBar, Globe } from "@phosphor-icons/react";
import Link from "next/link";
import { adminLogout } from "@/actions/auth";

interface SideDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with glassmorphism */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-xl z-[60] md:hidden hidden md:pointer-events-none"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.12)] z-[70] md:hidden overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                Menü
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <X weight="light" className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Profile Section */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#ed2630] font-bold text-sm">
                                    ÖA
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900">Özge Ayaz</span>
                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Yönetici</span>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-4">
                            <nav className="space-y-6">
                                {/* GENEL BAKIŞ */}
                                <div>
                                    <h3 className="px-4 text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-2">
                                        GENEL BAKIŞ
                                    </h3>
                                    <div className="space-y-1">
                                        <Link
                                            href="/admin"
                                            onClick={onClose}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group"
                                        >
                                            <div className="w-5 h-5 flex items-center justify-center">
                                                <Gear weight="light" className="w-5 h-5 text-slate-500 group-hover:text-[#ed2630] transition-colors" />
                                            </div>
                                            <span className="font-semibold tracking-tight text-slate-700 group-hover:text-slate-900">
                                                Kontrol Paneli
                                            </span>
                                        </Link>
                                        <Link
                                            href="/"
                                            target="_blank"
                                            onClick={onClose}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm"
                                        >
                                            <div className="w-5 h-5 flex items-center justify-center">
                                                <Globe weight="bold" className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold tracking-tight">
                                                Siteyi Görüntüle
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                {/* ANALİZLER */}
                                <div>
                                    <h3 className="px-4 text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-2">
                                        ANALİZLER
                                    </h3>
                                    <div className="space-y-1">
                                        <Link
                                            href="/admin/analytics/announcements"
                                            onClick={onClose}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group"
                                        >
                                            <ChartBar weight="light" className="w-5 h-5 text-slate-500 group-hover:text-[#ed2630] transition-colors" />
                                            <span className="font-semibold tracking-tight text-slate-700 group-hover:text-slate-900">
                                                Duyuru Analizleri
                                            </span>
                                        </Link>
                                        <Link
                                            href="/admin/analytics/meetings"
                                            onClick={onClose}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group"
                                        >
                                            <User weight="light" className="w-5 h-5 text-slate-500 group-hover:text-[#ed2630] transition-colors" />
                                            <span className="font-semibold tracking-tight text-slate-700 group-hover:text-slate-900">
                                                Toplantı Analizleri
                                            </span>
                                        </Link>
                                        <Link
                                            href="/admin/analytics/surveys"
                                            onClick={onClose}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group"
                                        >
                                            <Question weight="light" className="w-5 h-5 text-slate-500 group-hover:text-[#ed2630] transition-colors" />
                                            <span className="font-semibold tracking-tight text-slate-700 group-hover:text-slate-900">
                                                Anket Analizleri
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                {/* YAPILANDIRMA */}
                                <div>
                                    <h3 className="px-4 text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-2">
                                        YAPILANDIRMA
                                    </h3>
                                    <div className="space-y-1">
                                        <Link
                                            href="/admin/timeline"
                                            onClick={onClose}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group"
                                        >
                                            <Gear weight="light" className="w-5 h-5 text-slate-500 group-hover:text-[#ed2630] transition-colors" />
                                            <span className="font-semibold tracking-tight text-slate-700 group-hover:text-slate-900">
                                                Süreç Yönetimi
                                            </span>
                                        </Link>
                                        <Link
                                            href="/admin/page-builder"
                                            onClick={onClose}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group"
                                        >
                                            <Gear weight="light" className="w-5 h-5 text-slate-500 group-hover:text-[#ed2630] transition-colors" />
                                            <span className="font-semibold tracking-tight text-slate-700 group-hover:text-slate-900">
                                                Sayfa Tasarımı
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="pt-4 mt-4 border-t border-slate-100">
                                    <form action={adminLogout}>
                                        <button
                                            type="submit"
                                            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all text-red-600 group"
                                        >
                                            <SignOut weight="light" className="w-5 h-5" />
                                            <span className="font-semibold tracking-tight">
                                                Çıkış Yap
                                            </span>
                                        </button>
                                    </form>
                                </div>
                            </nav>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
