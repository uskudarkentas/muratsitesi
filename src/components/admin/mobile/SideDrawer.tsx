"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Gear, User, SignOut, Question } from "@phosphor-icons/react";
import Link from "next/link";

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
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ed2630] to-[#d11f2a] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    AY
                                </div>
                                <div>
                                    <p className="font-bold tracking-tight text-slate-900">
                                        Ahmet Yılmaz
                                    </p>
                                    <p className="text-sm text-slate-500 font-medium">
                                        Yönetici
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-4">
                            <nav className="space-y-1">
                                <Link
                                    href="/admin/profile"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group"
                                >
                                    <User weight="light" className="w-5 h-5 text-slate-500 group-hover:text-[#ed2630] transition-colors" />
                                    <span className="font-semibold tracking-tight text-slate-700 group-hover:text-slate-900">
                                        Profil
                                    </span>
                                </Link>

                                <Link
                                    href="/admin/settings"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group"
                                >
                                    <Gear weight="light" className="w-5 h-5 text-slate-500 group-hover:text-[#ed2630] transition-colors" />
                                    <span className="font-semibold tracking-tight text-slate-700 group-hover:text-slate-900">
                                        Ayarlar
                                    </span>
                                </Link>

                                <Link
                                    href="/admin/help"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group"
                                >
                                    <Question weight="light" className="w-5 h-5 text-slate-500 group-hover:text-[#ed2630] transition-colors" />
                                    <span className="font-semibold tracking-tight text-slate-700 group-hover:text-slate-900">
                                        Yardım
                                    </span>
                                </Link>

                                <div className="pt-4 mt-4 border-t border-slate-100">
                                    <Link
                                        href="/admin/logout"
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all text-red-600 group"
                                    >
                                        <SignOut weight="light" className="w-5 h-5" />
                                        <span className="font-semibold tracking-tight">
                                            Çıkış Yap
                                        </span>
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
