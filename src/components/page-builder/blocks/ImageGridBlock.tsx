"use client";

import { ImageGridBlock, GridImage } from "@/types/page-builder";
import Image from "next/image";
import { useRef, useState } from "react";
import { uploadFile } from "@/actions/upload";
import { Camera, ArrowsClockwise, CornersOut, GridFour, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";
import { cn } from "@/lib/utils";

interface ImageGridBlockProps {
    block: ImageGridBlock;
    isEditing?: boolean;
    onUpdate?: (newData: any) => void;
}

export function ImageGridBlockComponent({ block, isEditing = false, onUpdate }: ImageGridBlockProps) {
    const { images, columns = 2, aspectRatio = '3/4' } = block.data;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isShowingConfig, setIsShowingConfig] = useState(false);
    const [selectedLightboxIndex, setSelectedLightboxIndex] = useState<number | null>(null);

    const handleUpdate = (key: string, value: any) => {
        if (onUpdate) {
            onUpdate({ ...block.data, [key]: value });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
            let fileToUpload = file;
            if (file.type.startsWith('image/')) {
                fileToUpload = await imageCompression(file, options) as File;
            }

            const formData = new FormData();
            formData.append('file', fileToUpload);

            const result = await uploadFile(formData);
            if (result.success && result.url) {
                const newImages = [...images];
                newImages[index] = { ...newImages[index], url: result.url };
                handleUpdate('images', newImages);
            }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
            setActiveImageIndex(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <section className="w-full bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 pt-2 pb-2 md:pt-4 md:pb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm p-6 md:p-10">

                        {/* Configuration Toggle (Edit Mode) */}
                        {isEditing && (
                            <div className="absolute top-6 left-6 z-30">
                                <button
                                    onClick={() => setIsShowingConfig(!isShowingConfig)}
                                    className="bg-white/90 backdrop-blur p-2 rounded-xl border border-slate-200 shadow-sm text-slate-600 hover:text-[#ed2630] transition-colors"
                                >
                                    <GridFour size={20} weight="bold" />
                                </button>
                            </div>
                        )}

                        <AnimatePresence>
                            {isShowingConfig && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute top-16 left-6 z-40 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 w-64"
                                >
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Sütun Sayısı</span>
                                            <div className="flex gap-2">
                                                {[2, 3, 4].map((n) => (
                                                    <button
                                                        key={n}
                                                        onClick={() => handleUpdate('columns', n)}
                                                        className={cn(
                                                            "flex-1 py-1.5 rounded-lg text-xs font-bold transition-all",
                                                            columns === n ? "bg-[#ed2630] text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                                        )}
                                                    >
                                                        {n}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Görsel Oranı</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { id: '3/4', label: 'Dikey (3:4)' },
                                                    { id: '9/16', label: 'Dikey (9:16)' },
                                                    { id: '1/1', label: 'Kare (1:1)' },
                                                    { id: '16/9', label: 'Yatay (16:9)' },
                                                    { id: 'auto', label: 'Orijinal' }
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => handleUpdate('aspectRatio', opt.id)}
                                                        className={cn(
                                                            "py-1.5 rounded-lg text-[10px] font-bold transition-all",
                                                            aspectRatio === opt.id ? "bg-red-50 text-[#ed2630] border border-red-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                                        )}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Grid */}
                        <div className={cn(
                            "grid gap-4 md:gap-6",
                            columns === 2 ? "grid-cols-2" :
                                columns === 3 ? "grid-cols-2 md:grid-cols-3" :
                                    "grid-cols-2 lg:grid-cols-4"
                        )}>
                            {images.map((image, idx) => (
                                <div
                                    key={image.id || idx}
                                    className={cn(
                                        "relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group/item cursor-pointer",
                                        aspectRatio === '3/4' ? 'aspect-[3/4]' :
                                            aspectRatio === '9/16' ? 'aspect-[9/16]' :
                                                aspectRatio === '1/1' ? 'aspect-square' :
                                                    aspectRatio === '16/9' ? 'aspect-video' : 'h-auto'
                                    )}
                                    onClick={() => !isEditing && setSelectedLightboxIndex(idx)}
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt || `Görsel ${idx + 1}`}
                                        {...(aspectRatio === 'auto' ? {
                                            width: 1200,
                                            height: 1600,
                                            style: { width: '100%', height: 'auto' }
                                        } : {
                                            fill: true,
                                            className: "object-cover"
                                        })}
                                        unoptimized
                                    />

                                    {/* Edit Overlay */}
                                    {isEditing && (
                                        <div
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer z-10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveImageIndex(idx);
                                                fileInputRef.current?.click();
                                            }}
                                        >
                                            <div className="bg-white/90 p-3 rounded-full shadow-lg text-[#ed2630]">
                                                {isUploading && activeImageIndex === idx ? (
                                                    <ArrowsClockwise size={24} weight="bold" className="animate-spin" />
                                                ) : (
                                                    <Camera size={24} weight="bold" />
                                                )}
                                            </div>
                                            <span className="bg-white/90 px-3 py-1 rounded-lg text-[10px] font-bold text-slate-900 uppercase">Yükle</span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Add Image Slot (Edit Mode Only) */}
                            {isEditing && images.length < columns * 2 && (
                                <button
                                    onClick={() => {
                                        const newImages = [...images, { id: Date.now().toString(), url: 'https://placehold.co/600x800?text=Yeni+G%C3%B6rsel', alt: '' }];
                                        handleUpdate('images', newImages);
                                    }}
                                    className={cn(
                                        "relative rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-[#ed2630]/30 hover:text-[#ed2630]/50 transition-all group",
                                        aspectRatio === '3/4' ? 'aspect-[3/4]' :
                                            aspectRatio === '9/16' ? 'aspect-[9/16]' :
                                                aspectRatio === '1/1' ? 'aspect-square' :
                                                    aspectRatio === '16/9' ? 'aspect-video' : 'h-40'
                                    )}
                                >
                                    <div className="p-3 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                                        <GridFour size={24} weight="light" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Ekle</span>
                                </button>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => activeImageIndex !== null && handleImageUpload(e, activeImageIndex)}
                        />
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedLightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                        onClick={() => setSelectedLightboxIndex(null)}
                    >
                        {/* Close Button */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-6 right-6 z-[110] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLightboxIndex(null);
                            }}
                        >
                            <X size={24} weight="bold" />
                        </motion.button>

                        {/* Image Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="relative w-full max-w-5xl h-full max-h-[90vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-full max-h-full">
                                <Image
                                    src={images[selectedLightboxIndex].url}
                                    alt={images[selectedLightboxIndex].alt || "Büyütülmüş Görsel"}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                    priority
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
