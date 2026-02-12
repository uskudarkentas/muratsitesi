"use client";

import { ListBlock } from "@/types/page-builder";
import { InlineText } from "../InlineText";

interface ListBlockComponentProps {
    block: ListBlock;
    isEditing?: boolean;
    onUpdate?: (newData: any) => void;
}

import { useState } from "react";

// ... imports

export function ListBlockComponent({ block, isEditing = false, onUpdate }: ListBlockComponentProps) {
    const { title, items, listType = 'disc' } = block.data; // Default to 'disc'
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const handleUpdateTitle = (newTitle: string) => {
        if (onUpdate) {
            onUpdate({ ...block.data, title: newTitle });
        }
    };

    const handleUpdateListType = (type: 'disc' | 'decimal') => {
        if (onUpdate) {
            onUpdate({ ...block.data, listType: type });
        }
    };

    const handleUpdateItem = (index: number, newValue: string) => {
        if (onUpdate) {
            const newItems = [...items];
            newItems[index] = newValue;
            onUpdate({ ...block.data, items: newItems });
        }
    };

    const handleAddItem = (indexToInsertAfter: number = items.length - 1) => {
        if (onUpdate) {
            const newItems = [...items];
            newItems.splice(indexToInsertAfter + 1, 0, "");
            onUpdate({ ...block.data, items: newItems });
            setFocusedIndex(indexToInsertAfter + 1);
        }
    };

    const handleRemoveItem = (index: number) => {
        if (onUpdate && items.length > 0) {
            const newItems = items.filter((_, i) => i !== index);
            onUpdate({ ...block.data, items: newItems });
            // Focus previous item if available, otherwise next, or null
            if (index > 0) setFocusedIndex(index - 1);
            else if (newItems.length > 0) setFocusedIndex(0);
            else setFocusedIndex(null);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddItem(index);
        } else if (e.key === 'Backspace' && items[index] === '') {
            e.preventDefault();
            handleRemoveItem(index);
        }
    };



    return (

        <section className="w-full bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 pt-2 pb-2 md:pt-4 md:pb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="relative z-10 px-6 py-8 md:px-12 md:py-14">

                            {/* Header: Title + List Type Toggle */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex-1 mr-4">
                                    {(title || isEditing) && (
                                        isEditing ? (
                                            <InlineText
                                                value={title || ""}
                                                placeholder="Liste Başlığı (İsteğe bağlı)"
                                                onSave={handleUpdateTitle}
                                                tagName="h3"
                                                className="text-2xl md:text-3xl font-bold text-[#1a1b1f] dark:text-white"
                                            />
                                        ) : (
                                            title && (
                                                <h3 className="text-2xl md:text-3xl font-bold text-[#1a1b1f] dark:text-white">
                                                    {title}
                                                </h3>
                                            )
                                        )
                                    )}
                                </div>

                                {/* List Type Toggle (Visible only in edit mode) */}
                                {isEditing && (
                                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                                        <button
                                            onClick={() => handleUpdateListType('disc')}
                                            className={`p-1.5 rounded-md transition-all ${listType === 'disc' ? 'bg-white dark:bg-slate-600 shadow-sm text-[#ed2630]' : 'text-slate-400 hover:text-slate-600'}`}
                                            title="Maddeli Liste"
                                        >
                                            <span className="material-symbols-outlined !text-xl">format_list_bulleted</span>
                                        </button>
                                        <button
                                            onClick={() => handleUpdateListType('decimal')}
                                            className={`p-1.5 rounded-md transition-all ${listType === 'decimal' ? 'bg-white dark:bg-slate-600 shadow-sm text-[#ed2630]' : 'text-slate-400 hover:text-slate-600'}`}
                                            title="Numaralı Liste"
                                        >
                                            <span className="material-symbols-outlined !text-xl">format_list_numbered</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* List Items */}
                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div key={index} className="group flex items-start gap-4">
                                        {/* Marker */}
                                        <div className="flex-shrink-0 mt-[0.2em] select-none text-[#ed2630] font-bold text-lg w-8 text-right">
                                            {listType === 'decimal' ? `${index + 1}.` : '•'}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 relative">
                                            {isEditing ? (
                                                <>
                                                    <InlineText
                                                        value={item}
                                                        onSave={(val) => handleUpdateItem(index, val)}
                                                        tagName="div"
                                                        className="whitespace-pre-line outline-none w-full block text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                                        autoFocus={index === focusedIndex}
                                                        multiline={true}
                                                        placeholder="Madde içeriği..."
                                                        stripPastedNewlines={true}
                                                    />
                                                    <button
                                                        onClick={() => handleRemoveItem(index)}
                                                        className="opacity-0 group-hover:opacity-100 absolute -right-10 top-0 p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                        title="Maddeyi Sil"
                                                    >
                                                        <span className="material-symbols-outlined !text-xl">delete</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="whitespace-pre-wrap text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    {item}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Item Button */}
                            {isEditing && (
                                <div className="mt-6 pl-12">
                                    <button
                                        onClick={() => handleAddItem(items.length - 1)}
                                        className="flex items-center gap-2 text-sm font-medium text-[#ed2630] hover:bg-red-50 px-4 py-2.5 rounded-full transition-colors border border-dashed border-red-200 hover:border-red-300"
                                    >
                                        <span className="material-symbols-outlined !text-lg">add</span>
                                        Yeni Madde Ekle
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
