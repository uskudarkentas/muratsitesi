"use client";

import { ImageBlock } from "@/types/page-builder";
import Image from "next/image";
import { RichText } from "../RichText";
import { useRef, useState } from "react";
import { uploadFile } from "@/actions/upload";
import { Camera, ArrowsClockwise, CornersOut, Crop } from "@phosphor-icons/react";

import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";

interface ImageBlockComponentProps {
    block: ImageBlock;
    isEditing?: boolean;
    onUpdate?: (newData: any) => void;
}

export function ImageBlockComponent({ block, isEditing = false, onUpdate }: ImageBlockComponentProps) {
    const { url, alt, caption, aspectRatio = '21/9' } = block.data;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isShowingSelectors, setIsShowingSelectors] = useState(false);

    const handleUpdate = (key: string, value: string) => {
        if (onUpdate) {
            onUpdate({ ...block.data, [key]: value });
        }
    };

    const handleUpdateCaption = (val: string) => {
        handleUpdate('caption', val);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // Optimization options
            const options = {
                maxSizeMB: 1, // Max 1MB
                maxWidthOrHeight: 1920, // Max 1920px
                useWebWorker: true,
                initialQuality: 0.8
            };

            let fileToUpload = file;
            if (file.type.startsWith('image/')) {
                try {
                    fileToUpload = await imageCompression(file, options) as File;
                    console.log(`Optimized: ${file.size} -> ${fileToUpload.size}`);
                } catch (err) {
                    console.error("Compression error, uploading original:", err);
                }
            }

            const formData = new FormData();
            formData.append('file', fileToUpload);

            const result = await uploadFile(formData);
            if (result.success && result.url) {
                handleUpdate('url', result.url);
            } else {
                alert(result.error || "Görsel yüklenirken bir hata oluştu");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Görsel yüklenirken bir bağlantı hatası oluştu");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <section className="w-full bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 pt-2 pb-2 md:pt-4 md:pb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="relative z-10 px-6 py-8 md:px-12 md:py-14">
                            {/* Standard Image container */}
                            <div className={`relative w-full rounded-2xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 group/image
                                ${aspectRatio === '21/9' ? 'aspect-video md:aspect-[21/9]' :
                                    aspectRatio === '16/9' ? 'aspect-video' :
                                        aspectRatio === '4/3' ? 'aspect-[4/3]' :
                                            aspectRatio === '1/1' ? 'aspect-square max-w-2xl mx-auto' :
                                                'h-auto'}
                            `}>
                                <Image
                                    src={url}
                                    alt={alt || "Görsel"}
                                    {...(aspectRatio === 'auto' ? {
                                        width: 1200,
                                        height: 800,
                                        style: { width: '100%', height: 'auto' }
                                    } : {
                                        fill: true,
                                        className: "object-cover"
                                    })}
                                    unoptimized={true}
                                />

                                {/* Upload & Aspect Ratio Selection Overlay in Edit Mode */}
                                {isEditing && (
                                    <div
                                        className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 z-10 transition-opacity duration-300 ${isShowingSelectors ? 'opacity-100' : 'opacity-0 group-hover/image:opacity-100'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (isShowingSelectors) setIsShowingSelectors(false);
                                        }}
                                    >
                                        <AnimatePresence mode="wait">
                                            {!isShowingSelectors ? (
                                                <motion.div
                                                    key="actions"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="flex gap-4"
                                                >
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            !isUploading && fileInputRef.current?.click();
                                                        }}
                                                        className="flex flex-col items-center gap-2 group/btn"
                                                    >
                                                        <div className="bg-white/90 p-4 rounded-full shadow-lg text-[#ed2630] group-hover/btn:scale-110 transition-transform">
                                                            {isUploading ? (
                                                                <ArrowsClockwise size={32} weight="bold" className="animate-spin" />
                                                            ) : (
                                                                <Camera size={32} weight="bold" />
                                                            )}
                                                        </div>
                                                        <span className="bg-white/90 px-3 py-1 rounded-lg text-xs font-bold text-slate-900">Değiştir</span>
                                                    </button>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIsShowingSelectors(true);
                                                        }}
                                                        className="flex flex-col items-center gap-2 group/btn"
                                                    >
                                                        <div className="bg-white/90 p-4 rounded-full shadow-lg text-slate-700 group-hover/btn:scale-110 transition-transform">
                                                            <CornersOut size={32} weight="bold" />
                                                        </div>
                                                        <span className="bg-white/90 px-3 py-1 rounded-lg text-xs font-bold text-slate-900">Boyut</span>
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="selectors"
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-2xl flex flex-col gap-1 min-w-[220px]"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1 flex items-center justify-between">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Görsel Boyutu</span>
                                                        <button
                                                            onClick={() => setIsShowingSelectors(false)}
                                                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                                                        >
                                                            <ArrowsClockwise size={14} className="text-slate-400" weight="bold" />
                                                        </button>
                                                    </div>
                                                    {[
                                                        { id: '21/9', label: 'Sinematik (21:9)' },
                                                        { id: '16/9', label: 'Geniş (16:9)' },
                                                        { id: '4/3', label: 'Klasik (4:3)' },
                                                        { id: '1/1', label: 'Kare (1:1)' },
                                                        { id: 'auto', label: 'Orijinal Boyut' }
                                                    ].map((opt) => (
                                                        <button
                                                            key={opt.id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUpdate('aspectRatio', opt.id as any);
                                                                setIsShowingSelectors(false);
                                                            }}
                                                            className={`px-4 py-2.5 rounded-xl text-sm font-bold text-left transition-all flex items-center justify-between ${aspectRatio === opt.id ? 'bg-red-50 dark:bg-red-900/20 text-[#ed2630]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                                        >
                                                            {opt.label}
                                                            {aspectRatio === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-[#ed2630]" />}
                                                        </button>
                                                    ))}
                                                    <div className="mt-1 flex justify-center">
                                                        <button
                                                            onClick={() => setIsShowingSelectors(false)}
                                                            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 py-1 uppercase tracking-tight"
                                                        >
                                                            Vazgeç
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Caption */}
                            {(caption || isEditing) && (
                                <div className="mt-6" onClick={(e) => e.stopPropagation()}>
                                    {isEditing ? (
                                        <RichText
                                            value={caption || ""}
                                            onSave={handleUpdateCaption}
                                            className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 italic"
                                            placeholder="Görsel açıklaması ekleyin..."
                                        />
                                    ) : (
                                        caption && (
                                            <div
                                                className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 italic prose prose-sm dark:prose-invert max-w-none"
                                                dangerouslySetInnerHTML={{ __html: caption }}
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
