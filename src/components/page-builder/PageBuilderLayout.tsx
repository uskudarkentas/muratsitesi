"use client";

import { useState } from "react";
import { ContentBlock, BlockType } from "@/types/page-builder";
import { BlockSelector } from "./BlockSelector";
import { EditableBlockWrapper } from "./EditableBlockWrapper";
import { BlockEditModal } from "./BlockEditModal";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface PageBuilderLayoutProps {
    initialBlocks: ContentBlock[];
    onSave: (blocks: ContentBlock[]) => Promise<void>;
    pageSlug: string;
    headerContent?: React.ReactNode;
    stageNumber?: number;
}

export function PageBuilderLayout({
    initialBlocks,
    onSave,
    pageSlug,
    headerContent,
    stageNumber,
}: PageBuilderLayoutProps) {
    const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
    const [isSaving, setIsSaving] = useState(false);
    const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // 1. Yeni Blok Ekleme
    const handleAddBlock = (type: BlockType) => {
        const newBlock: ContentBlock = createDefaultBlock(type, blocks.length);
        setBlocks([...blocks, newBlock]);
    };

    // 2. Düzenleme Modalini Açma (handleEditClick)
    const handleEditClick = (block: ContentBlock) => {
        setEditingBlock(block);
        setIsEditModalOpen(true);
    };

    // 3. Modal Kaydetme (handleModalSave)
    const handleModalSave = (updatedBlock: ContentBlock) => {
        handleUpdateBlock(updatedBlock);
        setIsEditModalOpen(false);
        setEditingBlock(null);
    };

    // Update Logic (Common)
    const handleUpdateBlock = (updatedBlock: ContentBlock) => {
        setBlocks(blocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)));
    };

    // 4. Bloğu Silme
    const handleDeleteBlock = (blockId: string) => {
        if (confirm('Bu bloğu silmek istediğinizden emin misiniz?')) {
            setBlocks(blocks.filter((b) => b.id !== blockId));
        }
    };

    // 5. Sıralama İşlemleri
    const handleMoveUp = (blockId: string) => {
        const index = blocks.findIndex((b) => b.id === blockId);
        if (index > 0) {
            const newBlocks = [...blocks];
            [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
            newBlocks.forEach((block, i) => { block.order = i; });
            setBlocks(newBlocks);
        }
    };

    const handleMoveDown = (blockId: string) => {
        const index = blocks.findIndex((b) => b.id === blockId);
        if (index < blocks.length - 1) {
            const newBlocks = [...blocks];
            [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
            newBlocks.forEach((block, i) => { block.order = i; });
            setBlocks(newBlocks);
        }
    };

    // 6. Sayfayı Kaydetme (handlePageSave -> onSave prop)
    const handlePageSave = async () => {
        setIsSaving(true);
        try {
            await onSave(blocks);
            alert('Sayfa başarıyla kaydedildi!');
        } catch (error) {
            console.error('Save error:', error);
            alert('Kaydederken bir hata oluştu.');
        } finally {
            setIsSaving(false);
        }
    };

    // Determine Preview URL
    const getPreviewUrl = () => {
        if (pageSlug === 'home') return '/';
        if (['contact', 'risk-notice'].includes(pageSlug)) return `/${pageSlug}`;
        // Default to stage pages for everything else
        return `/asamalar/${pageSlug}`;
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Edit Modal */}
            {editingBlock && (
                <BlockEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleModalSave}
                    block={editingBlock}
                />
            )}

            {/* Left Sidebar - Block Selector */}
            <div className="w-80 flex-shrink-0 hidden lg:block">
                <BlockSelector onSelectBlock={handleAddBlock} />
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        {headerContent ? (
                            headerContent
                        ) : (
                            <div>
                                <h1 className="text-xl font-bold text-[#46474A] dark:text-white">
                                    Sayfa Düzenleyici
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {pageSlug}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={getPreviewUrl()}
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium text-sm"
                        >
                            <span className="material-symbols-outlined !text-lg">visibility</span>
                            Önizle
                        </Link>

                        <div className="h-8 w-px bg-slate-200 mx-2"></div>

                        <div className="text-xs text-slate-400 mr-2">
                            {blocks.length} blok
                        </div>
                        <button
                            onClick={handlePageSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-3 bg-[#ed2630] text-white font-bold rounded-xl hover:bg-[#d11f2a] disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg"
                        >
                            {isSaving ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">
                                        progress_activity
                                    </span>
                                    Kaydediliyor...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">save</span>
                                    Kaydet
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Canvas - Preview Area */}
                <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-8">
                    <div className="max-w-7xl mx-auto pb-20">
                        {/* Empty State */}
                        {blocks.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-12"
                            >
                                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
                                    <span className="material-symbols-outlined !text-5xl text-slate-400">
                                        add_box
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-[#46474A] dark:text-white mb-3">
                                    Sayfa Boş
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                                    Soldan bir içerik bloğu seçerek sayfanızı oluşturmaya başlayın.
                                </p>
                                <button
                                    onClick={() => handleAddBlock('hero')}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#ed2630] text-white font-bold rounded-xl hover:bg-[#d11f2a] transition-all"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                    Hero Bölümü Ekle
                                </button>
                            </motion.div>
                        )}

                        {/* Blocks */}
                        <div className="space-y-4">
                            <AnimatePresence>
                                {blocks.map((block, index) => (
                                    <motion.div
                                        key={block.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <EditableBlockWrapper
                                            block={block}
                                            onEdit={handleEditClick}
                                            onDelete={handleDeleteBlock}
                                            onMoveUp={handleMoveUp}
                                            onMoveDown={handleMoveDown}
                                            onUpdateBlock={handleUpdateBlock}
                                            isFirst={index === 0}
                                            isLast={index === blocks.length - 1}
                                            pageSlug={pageSlug}
                                            stageNumber={stageNumber}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper function to create default blocks
function createDefaultBlock(type: BlockType, order: number): ContentBlock {
    const id = `${type}-${Date.now()}`;

    switch (type) {
        case 'hero':
            return {
                id,
                type: 'hero',
                order,
                data: {
                    title: 'Başlık Buraya',
                    description: 'Açıklama metni buraya gelecek. Kentsel dönüşüm süreci hakkında bilgi verin.',
                    // Removed default button text to avoid confusion
                    ctaText: '',
                    ctaLink: '#'
                },
            };

        case 'info-card-grid':
            return {
                id,
                type: 'info-card-grid',
                order,
                data: {
                    cards: [
                        { id: `c1-${Date.now()}`, icon: 'UsersThree', title: 'Başlık', description: 'Metin' },
                        { id: `c2-${Date.now()}`, icon: 'FileText', title: 'Başlık', description: 'Metin' },
                        { id: `c3-${Date.now()}`, icon: 'ShieldCheck', title: 'Başlık', description: 'Metin' },
                    ],
                },
            };

        case 'announcement-banner':
            return {
                id,
                type: 'announcement-banner',
                order,
                data: {
                    icon: 'Megaphone',
                    title: 'Sitemiz İçin Hızlı Tarama',
                    description: 'Murat Sitesi bloklarında yapılacak hızlı tarama testleri için yönetime bildirimde bulunabilirsiniz.',
                    backgroundColor: '#98EB94' // Success green
                },
            };

        case 'document-list':
            return {
                id,
                type: 'document-list',
                order,
                data: {
                    title: 'İndirilebilir Dokümanlar',
                    documents: [],
                },
            };

        case 'text':
            return {
                id,
                type: 'text',
                order,
                data: {
                    content: '<p>Buraya metin giriniz...</p>',
                },
            };

        case 'image':
            return {
                id,
                type: 'image',
                order,
                data: {
                    url: 'https://placehold.co/1200x600',
                    alt: 'Görsel açıklaması',
                },
            };

        case 'divider':
            return {
                id,
                type: 'divider',
                order,
                data: {},
            };

        default:
            throw new Error(`Unknown block type: ${type}`);
    }
}
