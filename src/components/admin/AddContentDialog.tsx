"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllStages } from "@/actions/admin";
import { CreateStageForm } from "./forms/CreateStageForm";
import { CreateEventForm } from "./forms/CreateEventForm";
import { CreateAnnouncementForm } from "./forms/CreateAnnouncementForm";

interface AddContentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    insertPosition: number;
    initialContentType?: ContentType | null;
}

type ContentType = "stage" | "event" | "announcement";

interface Stage {
    id: number;
    title: string;
}

export function AddContentDialog({
    isOpen,
    onClose,
    insertPosition,
    initialContentType = null,
}: AddContentDialogProps) {
    console.log("DEBUG: AddContentDialog - Props:", {
        isOpen,
        initialContentType,
        insertPosition
    });
    const [contentType, setContentType] = useState<ContentType | null>(
        initialContentType || "announcement" // DEFAULT to announcement if no type specified
    );
    const [stages, setStages] = useState<Stage[]>([]);

    // Sync state with prop (Quick Action support)
    useEffect(() => {
        if (initialContentType) {
            setContentType(initialContentType);
        } else if (!isOpen) {
            // Reset when closed if not quick action
            setContentType(null);
        }
    }, [initialContentType, isOpen]);

    // Fetch stages (needed for Event/Announcement forms)
    useEffect(() => {
        async function fetchStages() {
            const result = await getAllStages();
            if (result.success && result.stages) {
                setStages(result.stages);
            }
        }
        if (isOpen) {
            fetchStages();
        }
    }, [isOpen]);

    const handleClose = () => {
        onClose();
        // Reset state after animation (timeout or effect? usually just resetting on open is enough, but handled in effect above)
    };

    const handleFormBack = () => {
        // If opened via Quick Action, 'Back' means Close.
        // If opened manually, 'Back' means go to Selection.
        if (initialContentType) {
            handleClose();
        } else {
            setContentType(null);
        }
    };

    const handleSuccess = () => {
        handleClose();
        // Ideally trigger a refresh or toast here, but server actions revalidate paths usually.
    };

    // Derived active type - ALWAYS has a value (defaults to announcement)
    const activeType = contentType || initialContentType || "announcement";

    const getTitle = () => {
        switch (activeType) {
            case "stage": return "Yeni Aşama Ekle";
            case "event": return "Toplantı/Etkinlik Ekle";
            case "announcement": return "Duyuru Yayınla";
            default: return "İçerik Ekle";
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
                            <h2 className="text-2xl font-bold text-foreground">
                                {getTitle()}
                            </h2>
                            <button
                                onClick={handleClose}
                                className="size-10 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Selection menu removed - always show form directly */}

                            {/* Forms */}
                            {activeType === "stage" && (
                                <CreateStageForm
                                    onClose={handleFormBack}
                                    onSuccess={handleSuccess}
                                    insertPosition={insertPosition}
                                />
                            )}
                            {activeType === "event" && (
                                <CreateEventForm
                                    onClose={handleFormBack}
                                    onSuccess={handleSuccess}
                                    stages={stages}
                                />
                            )}
                            {activeType === "announcement" && (
                                <CreateAnnouncementForm
                                    onClose={handleFormBack}
                                    onSuccess={handleSuccess}
                                    stages={stages}
                                />
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Helper Component for Selection Menu
function SelectionButton({ icon, title, description, onClick }: { icon: string, title: string, description: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
        >
            <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary !text-2xl">
                        {icon}
                    </span>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
        </button>
    );
}
