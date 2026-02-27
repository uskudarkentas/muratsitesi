"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "success" | "info";
    icon?: string;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Evet, Onayla",
    cancelLabel = "Vazgeç",
    variant = "danger",
    icon = "warning"
}: ConfirmDialogProps) {

    const variantStyles = {
        danger: {
            iconBg: "bg-red-100",
            iconText: "text-red-600",
            buttonBg: "bg-red-600 hover:bg-red-700 shadow-red-600/20",
        },
        success: {
            iconBg: "bg-green-100",
            iconText: "text-green-600",
            buttonBg: "bg-green-600 hover:bg-green-700 shadow-green-600/20",
        },
        info: {
            iconBg: "bg-blue-100",
            iconText: "text-blue-600",
            buttonBg: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20",
        }
    };

    const currentVariant = variantStyles[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-card relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border"
                    >
                        <div className="p-6 text-center">
                            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${currentVariant.iconBg} mb-4`}>
                                <span className={`material-symbols-outlined ${currentVariant.iconText} !text-3xl`}>
                                    {icon}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                {title}
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                {description}
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-xl border border-border font-medium hover:bg-secondary transition-colors"
                                >
                                    {cancelLabel}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className={`px-5 py-2.5 rounded-xl text-white font-medium transition-colors shadow-lg ${currentVariant.buttonBg}`}
                                >
                                    {confirmLabel}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
