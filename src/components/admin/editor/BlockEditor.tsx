"use client";

import { useState, useEffect } from "react";
import { BlockRenderer } from "./BlockRenderer";
import { updateStageContent } from "@/actions/admin";
import { Plus, FloppyDisk, Monitor, Trash } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';

interface Block {
    id: string;
    type: 'heading' | 'text' | 'image' | 'pdf' | 'gallery' | 'divider';
    value: string;
    level?: 1 | 2 | 3;
    fileName?: string;
    images?: string[];
    galleryStyle?: 'grid' | 'slider';
}

interface BlockEditorProps {
    stage: {
        id: number;
        title: string;
        content: any;
        sequenceOrder: number;
    };
    onClose: () => void;
    // Add external block insert support
    externalInsert?: { type: 'heading' | 'text' | 'image' | 'pdf' | 'gallery' | 'divider'; timestamp: number } | null;
}

export function BlockEditor({ stage, onClose, externalInsert }: BlockEditorProps) {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (stage.content) {
            try {
                const parsedContent = typeof stage.content === 'string'
                    ? JSON.parse(stage.content)
                    : stage.content;
                if (Array.isArray(parsedContent)) {
                    setBlocks(parsedContent);
                } else {
                    setBlocks([]);
                }
            } catch (e) {
                console.error('Failed to parse stage content:', e);
                setBlocks([]);
            }
        } else {
            setBlocks([]);
        }
    }, [stage.id, stage.content]);

    // Handle external block insertion from sidebar
    useEffect(() => {
        if (externalInsert) {
            addBlock(externalInsert.type);
        }
    }, [externalInsert]);

    const addBlock = (type: 'heading' | 'text' | 'image' | 'pdf' | 'gallery' | 'divider', level: 1 | 2 | 3 = 1) => {
        const newBlock: Block = {
            id: uuidv4(),
            type,
            value: type === 'divider' ? 'solid' : "",
            level: type === 'heading' ? level : undefined,
            images: type === 'gallery' ? [] : undefined,
            galleryStyle: type === 'gallery' ? 'grid' : undefined
        };
        setBlocks(prev => [...prev, newBlock]);
        setHasChanges(true);
    };

    const deleteBlock = (id: string) => {
        setBlocks(prev => prev.filter(b => b.id !== id));
        setHasChanges(true);
    };

    const updateBlock = (id: string, updates: Partial<Block>) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
        setHasChanges(true);
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= blocks.length) return;

        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        setBlocks(newBlocks);
        setHasChanges(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateStageContent(stage.id, blocks);
            if (result.success) {
                setHasChanges(false);
            } else {
                alert(result.error);
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 pb-32">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between mb-12 border-b border-slate-100 pb-6 sticky top-24 bg-background/80 backdrop-blur-sm z-30">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{stage.title}</h1>
                    <p className="text-slate-500 text-sm mt-1">Aşama #{stage.sequenceOrder} Tasarımı</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ed2630] text-white font-bold hover:bg-[#ed2630]/90 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <FloppyDisk size={20} weight="bold" />
                        )}
                        Kaydet
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                        title="Editörden Çık"
                    >
                        Kapalı
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="space-y-6">
                <AnimatePresence>
                    {blocks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4">
                                <Plus size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Sayfa Şu An Boş</h3>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                Sol taraftaki "İçerik Blokları" panelini kullanarak bu sayfaya başlık, metin veya medya ekleyebilirsiniz.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <button
                                    onClick={() => addBlock('heading', 1)}
                                    className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:border-[#ed2630] transition-colors"
                                >
                                    + Başlık Ekle
                                </button>
                                <button
                                    onClick={() => addBlock('text')}
                                    className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:border-[#ed2630] transition-colors"
                                >
                                    + Metin Ekle
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        blocks.map((block, index) => (
                            <motion.div
                                key={block.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="relative"
                            >
                                <BlockRenderer
                                    block={block}
                                    onUpdate={(updates) => updateBlock(block.id, updates)}
                                    onDelete={() => deleteBlock(block.id)}
                                    onMoveUp={() => moveBlock(index, 'up')}
                                    onMoveDown={() => moveBlock(index, 'down')}
                                    isFirst={index === 0}
                                    isLast={index === blocks.length - 1}
                                />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Quick Add at Bottom */}
            {blocks.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center gap-4">
                    <button
                        onClick={() => addBlock('heading', 2)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all text-sm font-bold"
                    >
                        <Plus size={16} weight="bold" />
                        Alt Başlık
                    </button>
                    <button
                        onClick={() => addBlock('text')}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all text-sm font-bold"
                    >
                        <Plus size={16} weight="bold" />
                        Paragraf
                    </button>
                    <button
                        onClick={() => addBlock('gallery')}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all text-sm font-bold"
                    >
                        <Plus size={16} weight="bold" />
                        Galeri/Slider
                    </button>
                    <button
                        onClick={() => addBlock('divider')}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all text-sm font-bold"
                    >
                        <Plus size={16} weight="bold" />
                        Ayraç
                    </button>
                </div>
            )}
        </div>
    );
}
