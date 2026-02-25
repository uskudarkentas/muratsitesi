"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "@phosphor-icons/react";

interface SaveStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "success" | "error";
    message: string;
}

export function SaveStatusModal({ isOpen, onClose, type, message }: SaveStatusModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full border border-slate-200 dark:border-slate-800"
                    >
                        <div className="p-8 flex flex-col items-center text-center">
                            {/* Icon Wrapper */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${type === "success"
                                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                    }`}
                            >
                                {type === "success" ? (
                                    <CheckCircle size={48} weight="fill" />
                                ) : (
                                    <XCircle size={48} weight="fill" />
                                )}
                            </motion.div>

                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                                {type === "success" ? "Başarılı!" : "Hata!"}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                                {message}
                            </p>

                            <button
                                onClick={onClose}
                                className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 ${type === "success"
                                        ? "bg-green-500 hover:bg-green-600 shadow-green-200 dark:shadow-none"
                                        : "bg-red-500 hover:bg-red-600 shadow-red-200 dark:shadow-none"
                                    }`}
                            >
                                Tamam
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
