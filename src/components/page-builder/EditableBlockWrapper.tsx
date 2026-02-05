"use client";

import { useState } from "react";
import { ContentBlock } from "@/types/page-builder";
import { BlockRenderer } from "./BlockRenderer";
import { motion, AnimatePresence } from "framer-motion";

interface EditableBlockWrapperProps {
    block: ContentBlock;
    onEdit: (block: ContentBlock) => void;
    onDelete: (blockId: string) => void;
    onMoveUp: (blockId: string) => void;
    onMoveDown: (blockId: string) => void;
    onUpdateBlock: (updatedBlock: ContentBlock) => void;
    isFirst: boolean;
    isLast: boolean;
}

export function EditableBlockWrapper({
    block,
    onEdit,
    onDelete,
    onMoveUp,
    onMoveDown,
    onUpdateBlock,
    isFirst,
    isLast,
}: EditableBlockWrapperProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Handle inline updates
    const handleInlineUpdate = (newData: any) => {
        onUpdateBlock({
            ...block,
            data: newData
        });
    };

    return (
        <div
            className="relative group w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Dashed Border Overlay */}
            {isHovered && (
                <div className="absolute inset-0 border-2 border-dashed border-[#ed2630] rounded-2xl pointer-events-none z-20" />
            )}

            {/* Action Buttons (Top Right) */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-white shadow-lg rounded-xl p-2 border border-slate-100"
                    >
                        <button
                            onClick={() => onMoveUp(block.id)}
                            disabled={isFirst}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Yukarı Taşı"
                        >
                            <span className="material-symbols-outlined !text-sm">arrow_upward</span>
                        </button>
                        <button
                            onClick={() => onMoveDown(block.id)}
                            disabled={isLast}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Aşağı Taşı"
                        >
                            <span className="material-symbols-outlined !text-sm">arrow_downward</span>
                        </button>
                        <div className="w-px h-4 bg-slate-200" />
                        <button
                            onClick={() => onEdit(block)}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                            title="Detaylı Düzenle"
                        >
                            <span className="material-symbols-outlined !text-sm">edit</span>
                        </button>
                        <button
                            onClick={() => onDelete(block.id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                            title="Sil"
                        >
                            <span className="material-symbols-outlined !text-sm">delete</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Block Content - Enable editing mode and pass update handler */}
            <div className={isHovered ? "opacity-100 blur-[0.2px] transition-all" : ""}>
                <BlockRenderer block={block} isEditing={true} onUpdate={handleInlineUpdate} />
            </div>
        </div>
    );
}
