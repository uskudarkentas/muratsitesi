"use client";

import { SliderBlock, SliderSlide } from "@/types/page-builder";
import { RichText } from "../RichText";
import { useRef, useState, useEffect } from "react";
import { uploadFile } from "@/actions/upload";
import { Camera, ArrowsClockwise, CaretLeft, CaretRight, Plus, Trash, MagnifyingGlassPlus, DownloadSimple, ShareNetwork } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import imageCompression from "browser-image-compression";

interface SliderBlockComponentProps {
    block: SliderBlock;
    isEditing?: boolean;
    onUpdate?: (newData: any) => void;
}

export function SliderBlockComponent({ block, isEditing = false, onUpdate }: SliderBlockComponentProps) {
    const { slides } = block.data;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingSlideIndex, setUploadingSlideIndex] = useState<number | null>(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const handleUpdate = (newSlides: SliderSlide[]) => {
        if (onUpdate) {
            onUpdate({ ...block.data, slides: newSlides });
        }
    };

    const handleAddSlide = () => {
        const newSlide: SliderSlide = {
            id: uuidv4(),
            url: "https://placehold.co/1200x600?text=Yeni+Slide",
            caption: "Slide Açıklaması",
            title: "Slide Başlığı"
        };
        handleUpdate([...slides, newSlide]);
        setCurrentIndex(slides.length);
    };

    const handleRemoveSlide = (index: number) => {
        if (slides.length <= 1) return;
        const newSlides = slides.filter((_, i) => i !== index);
        handleUpdate(newSlides);
        if (currentIndex >= newSlides.length) {
            setCurrentIndex(newSlides.length - 1);
        }
    };

    const handleUpdateSlide = (index: number, key: keyof SliderSlide, value: string) => {
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], [key]: value };
        handleUpdate(newSlides);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadingSlideIndex(index);
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
                    console.log(`Optimized Slider Item: ${file.size} -> ${fileToUpload.size}`);
                } catch (err) {
                    console.error("Compression error, uploading original:", err);
                }
            }

            const formData = new FormData();
            formData.append('file', fileToUpload);

            const result = await uploadFile(formData);
            if (result.success && result.url) {
                handleUpdateSlide(index, 'url', result.url);
            } else {
                alert(result.error || "Görsel yüklenirken bir hata oluştu");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Görsel yüklenirken bir bağlantı hatası oluştu");
        } finally {
            setIsUploading(false);
            setUploadingSlideIndex(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename || 'slider-image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download error:", error);
            // Fallback for cross-origin or other issues
            window.open(url, '_blank');
        }
    };

    const handleShare = async (url: string, title: string) => {
        const shareData = {
            title: title || 'Murat Sitesi - Görsel Paylaşımı',
            text: 'Bu görseli Murat Sitesi sayfasında inceleyin.',
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback: WhatsApp share link
            const encodedText = encodeURIComponent(`${shareData.text}\n\n${shareData.url}`);
            window.open(`https://wa.me/?text=${encodedText}`, '_blank');
        }
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Auto-play in non-edit mode
    useEffect(() => {
        if (!isEditing && slides.length > 1) {
            const timer = setInterval(nextSlide, 5000);
            return () => clearInterval(timer);
        }
    }, [isEditing, slides.length]);

    if (slides.length === 0 && !isEditing) return null;

    return (
        <section className="w-full bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 pt-2 pb-2 md:pt-4 md:pb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="relative z-10 px-6 py-8 md:px-12 md:py-14">

                            {/* Main Slider Container */}
                            <div className="relative group/slider rounded-3xl overflow-hidden shadow-lg bg-slate-900 border border-slate-200 dark:border-slate-800 aspect-video md:aspect-[21/9]">

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5 }}
                                        className={`absolute inset-0 ${!isEditing ? "cursor-pointer" : ""}`}
                                        onClick={() => !isEditing && setIsLightboxOpen(true)}
                                    >
                                        <Image
                                            src={slides[currentIndex]?.url || "https://placehold.co/1200x600"}
                                            alt={slides[currentIndex]?.title || "Slider"}
                                            fill
                                            className="object-cover"
                                            unoptimized={true}
                                        />

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                                            <div className="max-w-3xl">
                                                {isEditing ? (
                                                    <div className="space-y-2">
                                                        <RichText
                                                            value={slides[currentIndex]?.title || ""}
                                                            onSave={(val) => handleUpdateSlide(currentIndex, 'title', val)}
                                                            className="text-2xl md:text-4xl font-bold mb-2 text-white"
                                                            placeholder="Sürgü Başlığı"
                                                        />
                                                        <RichText
                                                            value={slides[currentIndex]?.caption || ""}
                                                            onSave={(val) => handleUpdateSlide(currentIndex, 'caption', val)}
                                                            className="text-sm md:text-lg text-slate-200"
                                                            placeholder="Sürgü Açıklaması"
                                                        />
                                                    </div>
                                                ) : (
                                                    <>
                                                        {slides[currentIndex]?.title && (
                                                            <div className="text-2xl md:text-4xl font-bold mb-2 leading-tight" dangerouslySetInnerHTML={{ __html: slides[currentIndex].title }} />
                                                        )}
                                                        {slides[currentIndex]?.caption && (
                                                            <div className="text-sm md:text-lg text-slate-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: slides[currentIndex].caption }} />
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Slide Management Controls (Edit mode) */}
                                {isEditing && (
                                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="p-3 bg-white/90 rounded-full text-[#ed2630] shadow-lg hover:scale-110 transition-transform"
                                            title="Görseli Değiştir"
                                        >
                                            {isUploading && uploadingSlideIndex === currentIndex ? (
                                                <ArrowsClockwise size={20} className="animate-spin" />
                                            ) : (
                                                <Camera size={20} weight="bold" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleRemoveSlide(currentIndex)}
                                            className="p-3 bg-white/90 rounded-full text-red-500 shadow-lg hover:scale-110 transition-transform"
                                            title="Sürgüyü Sil"
                                        >
                                            <Trash size={20} weight="bold" />
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, currentIndex)}
                                        />
                                    </div>
                                )}

                                {/* View/Download Controls (Visible always but distinct) */}
                                {!isEditing && (
                                    <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20 flex gap-2 md:gap-3">
                                        <button
                                            onClick={() => handleShare(slides[currentIndex].url, slides[currentIndex].title || "")}
                                            className="p-2 md:p-3 bg-white/90 hover:bg-white rounded-full text-[#ed2630] shadow-lg transition-all border border-slate-200"
                                            title="Paylaş"
                                        >
                                            <ShareNetwork size={18} weight="bold" className="md:hidden" />
                                            <ShareNetwork size={22} weight="bold" className="hidden md:block" />
                                        </button>
                                        <button
                                            onClick={() => setIsLightboxOpen(true)}
                                            className="p-2 md:p-3 bg-white/90 hover:bg-white rounded-full text-[#ed2630] shadow-lg transition-all border border-slate-200"
                                            title="Büyüt"
                                        >
                                            <MagnifyingGlassPlus size={18} weight="bold" className="md:hidden" />
                                            <MagnifyingGlassPlus size={22} weight="bold" className="hidden md:block" />
                                        </button>
                                        <button
                                            onClick={() => handleDownload(slides[currentIndex].url, `slide-${currentIndex + 1}.jpg`)}
                                            className="p-2 md:p-3 bg-white/90 hover:bg-white rounded-full text-[#ed2630] shadow-lg transition-all border border-slate-200"
                                            title="İndir"
                                        >
                                            <DownloadSimple size={18} weight="bold" className="md:hidden" />
                                            <DownloadSimple size={22} weight="bold" className="hidden md:block" />
                                        </button>
                                    </div>
                                )}

                                {/* Navigation Arrows */}
                                {slides.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all backdrop-blur-sm group/btn"
                                        >
                                            <CaretLeft size={20} weight="bold" className="md:hidden group-hover/btn:-translate-x-0.5 transition-transform" />
                                            <CaretLeft size={24} weight="bold" className="hidden md:block group-hover/btn:-translate-x-0.5 transition-transform" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all backdrop-blur-sm group/btn"
                                        >
                                            <CaretRight size={20} weight="bold" className="md:hidden group-hover/btn:translate-x-0.5 transition-transform" />
                                            <CaretRight size={24} weight="bold" className="hidden md:block group-hover/btn:translate-x-0.5 transition-transform" />
                                        </button>
                                    </>
                                )}

                                {/* Dots */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                    {slides.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentIndex(i)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentIndex
                                                ? "bg-[#ed2630] w-8"
                                                : "bg-white/50 hover:bg-white"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Thumbnails / Management List (Edit Mode only) */}
                            {isEditing && (
                                <div className="mt-8 overflow-x-auto pb-4">
                                    <div className="flex gap-4">
                                        {slides.map((slide, index) => (
                                            <div
                                                key={slide.id}
                                                onClick={() => setCurrentIndex(index)}
                                                className={`relative w-40 h-24 rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 border-2 transition-all ${index === currentIndex
                                                    ? "border-[#ed2630] scale-105 shadow-md"
                                                    : "border-transparent opacity-60 hover:opacity-100"
                                                    }`}
                                            >
                                                <Image
                                                    src={slide.url}
                                                    alt={slide.title || ""}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized={true}
                                                />
                                                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 rounded-md">
                                                    {index + 1}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            onClick={handleAddSlide}
                                            className="w-40 h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:text-[#ed2630] hover:border-[#ed2630] hover:bg-red-50 transition-all flex-shrink-0"
                                        >
                                            <Plus size={24} />
                                            <span className="text-xs font-bold mt-1 uppercase">Sürgü Ekle</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox for full screen viewing */}
            <Lightbox
                open={isLightboxOpen}
                close={() => setIsLightboxOpen(false)}
                index={currentIndex}
                slides={slides.map(slide => ({ src: slide.url }))}
                plugins={[Zoom]}
                on={{ view: ({ index }) => setCurrentIndex(index) }}
                styles={{
                    container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
                }}
            />
        </section>
    );
}
