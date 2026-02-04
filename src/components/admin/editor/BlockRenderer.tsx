"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Trash, ArrowUp, ArrowDown, Plus, PencilSimple, Image as ImageIcon, FilePdf, TextT, TextHOne, TextHTwo, TextHThree } from "@phosphor-icons/react";
import imageCompression from "browser-image-compression";

interface Block {
    id: string;
    type: 'heading' | 'text' | 'image' | 'pdf' | 'gallery' | 'divider';
    value: string;
    level?: 1 | 2 | 3;
    fileName?: string;
    images?: string[];
    galleryStyle?: 'grid' | 'slider';
}

interface BlockRendererProps {
    block: Block;
    onUpdate: (updates: Partial<Block>) => void;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    isFirst: boolean;
    isLast: boolean;
}

function BlockActions({ onMoveUp, onMoveDown, onDelete, isFirst, isLast }: any) {
    return (
        <div className="absolute -left-12 top-0 flex flex-col gap-1 p-1 bg-white border border-slate-200 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
                onClick={onMoveUp}
                disabled={isFirst}
                className="p-1 hover:bg-slate-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                title="Yukarı Taşı"
            >
                <ArrowUp size={16} weight="bold" />
            </button>
            <button
                onClick={onMoveDown}
                disabled={isLast}
                className="p-1 hover:bg-slate-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                title="Aşağı Taşı"
            >
                <ArrowDown size={16} weight="bold" />
            </button>
            <div className="h-[1px] bg-slate-100 my-1" />
            <button
                onClick={onDelete}
                className="p-1 hover:bg-red-50 text-red-500 rounded"
                title="Sil"
            >
                <Trash size={16} weight="bold" />
            </button>
        </div>
    );
}

export function BlockRenderer({ block, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: BlockRendererProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(block.value);

    const handleSave = () => {
        onUpdate({ value: editValue });
        setIsEditing(false);
    };

    const uploadFile = async (file: File, isGallery: boolean = false) => {
        let finalFile = file;

        // Compression for images
        if (block.type === 'image' || isGallery) {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            };
            try {
                console.log("Compressing image...");
                finalFile = await imageCompression(file, options);
            } catch (error) {
                console.error("Compression failed:", error);
            }
        }

        const formData = new FormData();
        formData.append("file", finalFile);

        try {
            const response = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (result.success) {
                return { url: result.url, name: file.name };
            }
        } catch (error) {
            console.error("Upload failed:", error);
        }
        return null;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await uploadFile(file);
        if (result) {
            onUpdate({ value: result.url, fileName: result.name });
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const uploadedUrls: string[] = [];
        for (const file of files) {
            const result = await uploadFile(file, true);
            if (result) uploadedUrls.push(result.url);
        }

        onUpdate({ images: [...(block.images || []), ...uploadedUrls] });
    };

    return (
        <div className="group relative w-full mb-4 px-12">
            <BlockActions
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onDelete={onDelete}
                isFirst={isFirst}
                isLast={isLast}
            />

            {block.type === 'heading' && (
                <div
                    className={cn(
                        "cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-200",
                        block.level === 1 ? "text-3xl font-bold" :
                            block.level === 2 ? "text-2xl font-bold" : "text-xl font-bold"
                    )}
                    onClick={() => setIsEditing(true)}
                >
                    {isEditing ? (
                        <input
                            autoFocus
                            className="w-full bg-transparent outline-none"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        />
                    ) : (
                        block.value || "Başlık Yazın..."
                    )}
                </div>
            )}

            {block.type === 'text' && (
                <div
                    className="cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-200 text-slate-600 leading-relaxed min-h-[1.5em]"
                    onClick={() => setIsEditing(true)}
                >
                    {isEditing ? (
                        <textarea
                            autoFocus
                            className="w-full bg-transparent outline-none resize-none"
                            rows={3}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSave}
                        />
                    ) : (
                        block.value || "Metin yazmak için tıklayın..."
                    )}
                </div>
            )}

            {block.type === 'image' && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 min-h-[200px] flex items-center justify-center group/img">
                    {block.value ? (
                        <>
                            <img src={block.value} alt="Block" className="w-full h-auto object-contain" />
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                                <Plus size={32} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </>
                    ) : (
                        <label className="flex flex-col items-center gap-2 cursor-pointer text-slate-400 p-8">
                            <ImageIcon size={48} weight="light" />
                            <span className="text-sm font-medium">Görsel Yükle</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    )}
                </div>
            )}

            {block.type === 'pdf' && (
                <div className="border border-slate-200 rounded-xl p-4 bg-white flex items-center gap-4 group/pdf">
                    <div className="w-12 h-12 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                        <FilePdf size={24} weight="bold" />
                    </div>
                    <div className="flex-1">
                        <span className="block font-bold text-slate-700 truncate">
                            {block.fileName || "PDF Dosyası"}
                        </span>
                        <span className="text-xs text-slate-400">PDF Belgesi</span>
                    </div>
                    <label className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                        <Plus size={20} weight="bold" className="text-slate-400" />
                        <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                    </label>
                </div>
            )}

            {block.type === 'gallery' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <ImageIcon size={20} className="text-slate-400" />
                            <span className="font-bold text-slate-700">Görsel Galerisi</span>
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button
                                onClick={() => onUpdate({ galleryStyle: 'grid' })}
                                className={cn(
                                    "px-3 py-1 text-xs font-bold rounded-md transition-all",
                                    (block.galleryStyle || 'grid') === 'grid' ? "bg-white text-[#ed2630] shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                Izgara
                            </button>
                            <button
                                onClick={() => onUpdate({ galleryStyle: 'slider' })}
                                className={cn(
                                    "px-3 py-1 text-xs font-bold rounded-md transition-all",
                                    block.galleryStyle === 'slider' ? "bg-white text-[#ed2630] shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                Slider
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(block.images || []).map((url, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group/gal">
                                <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => onUpdate({ images: block.images?.filter((_, idx) => idx !== i) })}
                                    className="absolute top-1 right-1 p-1.5 bg-white shadow-md rounded-full text-red-500 opacity-0 group-hover/gal:opacity-100 transition-opacity"
                                >
                                    <Trash size={12} weight="bold" />
                                </button>
                            </div>
                        ))}
                        <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#ed2630] hover:bg-slate-50 transition-all text-slate-400">
                            <Plus size={24} />
                            <span className="text-[10px] font-bold mt-1">Görsel Ekle</span>
                            <input type="file" className="hidden" accept="image/*" multiple onChange={handleGalleryUpload} />
                        </label>
                    </div>
                </div>
            )}

            {block.type === 'divider' && (
                <div
                    className="py-8 flex justify-center cursor-pointer group/div"
                    onClick={() => onUpdate({ value: block.value === 'dashed' ? 'solid' : 'dashed' })}
                >
                    <div className={cn(
                        "w-full max-w-sm border-t-2",
                        block.value === 'dashed' ? "border-dashed border-slate-200" : "border-solid border-slate-100"
                    )} />
                </div>
            )}
        </div>
    );
}
