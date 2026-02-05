"use client";

import { BlockType } from "@/types/page-builder";
import { motion } from "framer-motion";

interface BlockTemplate {
    type: BlockType;
    icon: string;
    label: string;
    description: string;
}

const blockTemplates: BlockTemplate[] = [
    {
        type: 'hero',
        icon: 'image',
        label: 'Hero Bölümü',
        description: 'Başlık, açıklama ve arka plan görseli',
    },
    {
        type: 'info-card-grid',
        icon: 'grid_view',
        label: 'Bilgi Kartları',
        description: '3\'lü ikonlu kart dizisi',
    },
    {
        type: 'announcement-banner',
        icon: 'campaign',
        label: 'Duyuru Banner',
        description: 'Yeşil arka planlı duyuru bloğu',
    },
    {
        type: 'document-list',
        icon: 'description',
        label: 'Doküman Listesi',
        description: 'İndirilebilir dosya listesi',
    },
    {
        type: 'text',
        icon: 'text_fields',
        label: 'Metin Bloğu',
        description: 'Zengin metin içeriği',
    },
    {
        type: 'image',
        icon: 'photo',
        label: 'Görsel',
        description: 'Tek görsel bloğu',
    },
    {
        type: 'divider',
        icon: 'horizontal_rule',
        label: 'Ayırıcı',
        description: 'Yatay çizgi',
    },
];

interface BlockSelectorProps {
    onSelectBlock: (type: BlockType) => void;
}

export function BlockSelector({ onSelectBlock }: BlockSelectorProps) {
    return (
        <div className="h-full overflow-y-auto bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-[#46474A] dark:text-white mb-2">
                    İçerik Blokları
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sayfanıza eklemek için bir blok seçin
                </p>
            </div>

            {/* Block List */}
            <div className="p-4 space-y-3">
                {blockTemplates.map((template) => (
                    <motion.button
                        key={template.type}
                        onClick={() => onSelectBlock(template.type)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 transition-all text-left group"
                    >
                        {/* Icon */}
                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 group-hover:border-[#ed2630] group-hover:bg-[#ed2630]/5 transition-all">
                            <span className="material-symbols-outlined !text-2xl text-slate-600 dark:text-slate-300 group-hover:text-[#ed2630]">
                                {template.icon}
                            </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-[#46474A] dark:text-white mb-1 group-hover:text-[#ed2630] transition-colors">
                                {template.label}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                {template.description}
                            </p>
                        </div>

                        {/* Add Icon */}
                        <div className="flex-shrink-0">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-[#ed2630] transition-colors">
                                add_circle
                            </span>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
