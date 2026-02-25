"use client";

import { VideoBlock } from "@/types/page-builder";
import { useState, useRef, useEffect } from "react";
import { Play, VideoCamera, FileVideo, Upload, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { RichText } from "../RichText";
import { InlineText } from "../InlineText";
import { uploadFile } from "@/actions/upload";
import { motion, AnimatePresence, useInView } from "framer-motion";

interface VideoBlockProps {
    block: VideoBlock;
    isEditing?: boolean;
    onUpdate?: (newData: any) => void;
}

export function VideoBlockComponent({ block, isEditing = false, onUpdate }: VideoBlockProps) {
    const { url, title, description, buttonText = "Videoyu İzle" } = block.data;
    const [isUploading, setIsUploading] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Intersection Observer for scroll-based autoplay
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { amount: 0.6 });

    // Handle scroll-based play/pause and sound
    useEffect(() => {
        if (!videoRef.current || isEditing) return;

        if (isInView && !isLightboxOpen) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    if (videoRef.current) videoRef.current.muted = false;
                }).catch(() => {
                    if (videoRef.current) {
                        videoRef.current.muted = true;
                        videoRef.current.play();
                    }
                });
            }
        } else {
            videoRef.current.pause();
        }
    }, [isInView, isEditing, isLightboxOpen]);

    const handleUpdate = (key: string, value: string) => {
        if (onUpdate) {
            onUpdate({ ...block.data, [key]: value });
        }
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const result = await uploadFile(formData);
            if (result.success) {
                handleUpdate('url', result.url);
            }
        } catch (error) {
            console.error("Video upload failed:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <section className="w-full bg-slate-50 dark:bg-slate-900" ref={containerRef}>
            <div className="container mx-auto px-4 pt-4 pb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">

                        {/* Horizontal Split Card */}
                        <div className="flex flex-col md:flex-row bg-white dark:bg-slate-900 overflow-hidden">

                            {/* Left: Video Area */}
                            <div
                                className="relative w-full md:w-[350px] h-[550px] md:h-[600px] overflow-hidden flex-shrink-0 bg-slate-900 group/video cursor-pointer"
                                onClick={() => !isEditing && url && setIsLightboxOpen(true)}
                            >
                                {url ? (
                                    <video
                                        ref={videoRef}
                                        src={url}
                                        className="w-full h-full object-cover"
                                        playsInline
                                        muted
                                        loop
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                                        <VideoCamera size={64} weight="light" />
                                        <span className="text-sm font-bold uppercase tracking-widest">Video Bekleniyor</span>
                                    </div>
                                )}

                                {isEditing && (
                                    <div
                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover/video:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            videoInputRef.current?.click();
                                        }}
                                    >
                                        <div className="bg-white/90 p-5 rounded-full shadow-2xl text-[#ed2630] transform scale-90 group-hover/video:scale-100 transition-transform duration-300">
                                            {isUploading ? (
                                                <div className="w-8 h-8 border-4 border-[#ed2630]/30 border-t-[#ed2630] rounded-full animate-spin" />
                                            ) : (
                                                <Upload size={32} weight="bold" />
                                            )}
                                        </div>
                                        <span className="bg-white/90 px-4 py-2 rounded-xl text-xs font-black text-slate-900 uppercase tracking-widest">Video Yükle</span>
                                        <input
                                            type="file"
                                            ref={videoInputRef}
                                            className="hidden"
                                            accept="video/*"
                                            onChange={handleVideoUpload}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Right: Content */}
                            <div className="flex-1 p-8 md:p-14 flex flex-col justify-center bg-gradient-to-br from-white via-white to-slate-50/30">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-[#ed2630]">
                                        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center">
                                            <FileVideo size={22} weight="fill" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Video Tanıtımı</span>
                                    </div>

                                    <div onClick={(e) => e.stopPropagation()}>
                                        {isEditing ? (
                                            <RichText
                                                value={title}
                                                onSave={(val) => handleUpdate('title', val)}
                                                className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-4 tracking-tight"
                                                placeholder="Video Başlığı"
                                            />
                                        ) : (
                                            <h3
                                                className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-4 tracking-tight"
                                                dangerouslySetInnerHTML={{ __html: title }}
                                            />
                                        )}

                                        {isEditing ? (
                                            <RichText
                                                value={description || ""}
                                                onSave={(val) => handleUpdate('description', val)}
                                                className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed"
                                                placeholder="Kısa bir açıklama ekleyin..."
                                            />
                                        ) : (
                                            description && (
                                                <div
                                                    className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed prose prose-lg dark:prose-invert max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: description }}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="mt-10">
                                    {isEditing ? (
                                        <div className="w-fit" onClick={(e) => e.stopPropagation()}>
                                            <InlineText
                                                value={buttonText}
                                                onSave={(val) => handleUpdate('buttonText', val)}
                                                className="inline-flex items-center gap-3 px-6 py-3 bg-[#ed2630] text-white font-bold rounded-xl hover:bg-[#d11f2a] transition-all shadow-md text-sm uppercase tracking-wider"
                                                placeholder="Buton Metni"
                                            />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsLightboxOpen(true)}
                                            className="w-fit flex items-center gap-3 px-6 py-3 bg-[#ed2630] text-white font-bold rounded-xl hover:bg-[#d11f2a] transition-all shadow-md hover:shadow-lg active:scale-95 group/btn text-sm uppercase tracking-wider"
                                        >
                                            <Play size={18} weight="bold" className="group-hover/btn:translate-x-1 transition-transform" />
                                            {buttonText}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Video Lightbox */}
            <AnimatePresence>
                {isLightboxOpen && url && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        {/* Close Button */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors border border-white/10 z-[110]"
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <X size={24} weight="bold" />
                        </motion.button>

                        {/* Video Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <video
                                src={url}
                                className="w-full h-full"
                                controls
                                autoPlay
                                playsInline
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
