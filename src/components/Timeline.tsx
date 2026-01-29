"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getLatestAnnouncement, getAnnouncementPreview } from "@/lib/mockData";
import { STAGES } from "@/lib/stages";
import Link from "next/link";

export default function Timeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [mobilePopupIndex, setMobilePopupIndex] = useState<number | null>(null);

    const handleShare = async (stage: any) => {
        const latestAnnouncement = getLatestAnnouncement(stage.id);
        const text = latestAnnouncement
            ? getAnnouncementPreview(latestAnnouncement)
            : "Murat Sitesi Kentsel Dönüşüm Süreci";

        const shareData = {
            title: `Murat Sitesi - ${stage.title}`,
            text: text,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
                alert("Bağlantı kopyalandı!");
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const ACTIVE_STAGE_ID = 7; // Riskli Yapı İlanı

    const handleScroll = () => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const { scrollTop } = container;
        const calculatedIndex = Math.round(scrollTop / 128);
        const index = Math.max(0, Math.min(STAGES.length - 1, calculatedIndex));
        setFocusedIndex(index);
    };

    useEffect(() => {
        if (containerRef.current) {
            const activeStageIndex = STAGES.findIndex((s) => s.id === ACTIVE_STAGE_ID);
            if (activeStageIndex !== -1) {
                setTimeout(() => {
                    containerRef.current?.scrollTo({
                        top: activeStageIndex * 128,
                        behavior: "instant",
                    });
                    setFocusedIndex(activeStageIndex);
                }, 100);
            }
        }
    }, []);

    const activeStageIndex = STAGES.findIndex((s) => s.id === ACTIVE_STAGE_ID);

    return (
        <div className="relative w-full max-w-7xl mx-auto flex justify-center items-start">
            {/* Central Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-700 z-0"></div>

            {/* Scrollable Container */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="relative z-10 w-full h-[640px] overflow-y-auto no-scrollbar snap-y snap-mandatory py-[256px]"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

                {STAGES.map((stage, index) => {
                    // Logic to determine active states
                    const isFocused = focusedIndex === index;
                    const isCurrent = stage.id === ACTIVE_STAGE_ID;
                    const isPast = stage.id < ACTIVE_STAGE_ID;
                    const isFuture = stage.id > ACTIVE_STAGE_ID;

                    return (
                        <motion.div
                            key={stage.id}
                            className="w-full flex justify-center items-center h-32 snap-center relative"
                        >
                            {/* Left Side Label - Responsive for all screen sizes */}
                            <motion.div
                                animate={{
                                    opacity: isFocused ? 1 : 0.5,
                                    x: isFocused ? 0 : 20,
                                }}
                                className={cn(
                                    "absolute transition-all duration-300",
                                    "left-2 md:right-[55%] md:left-auto",
                                    "text-left md:text-right md:pr-8",
                                    "max-w-[35%] md:max-w-none",
                                    isCurrent && "font-bold",
                                    isPast && "text-gray-500",
                                    isFuture && "text-gray-300"
                                )}
                            >
                                <span
                                    className={cn(
                                        "block transition-all break-words leading-tight",
                                        isFocused ? "text-sm md:text-2xl font-bold" : "text-xs md:text-xl font-medium",
                                        isCurrent && "text-[#98EB94]"
                                    )}
                                >
                                    {stage.title}
                                </span>
                                {isPast && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-1 justify-start md:justify-end text-[#98EB94] text-xs md:text-sm mt-1 font-bold"
                                    >
                                        <span>Tamamlandı</span>
                                        <span className="material-symbols-outlined !text-sm">check</span>
                                    </motion.div>
                                )}
                                {isCurrent && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-1 justify-start md:justify-end text-[#98EB94] text-[10px] md:text-xs mt-1 font-medium"
                                    >
                                        <span>Süreç Devam Ediyor</span>
                                        <span className="material-symbols-outlined !text-sm animate-spin">sync</span>
                                    </motion.div>
                                )}
                                {isFuture && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-1 justify-start md:justify-end text-gray-400 text-[10px] md:text-xs mt-1 font-medium"
                                    >
                                        <span>Sürece Başlanmadı</span>
                                        <span className="material-symbols-outlined !text-sm">lock</span>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Center Icon Circle */}
                            <motion.div
                                animate={{
                                    scale: isCurrent && isFocused ? 1.5 : isFocused ? 1.2 : 1,
                                }}
                                className={cn(
                                    "relative flex items-center justify-center rounded-full z-20 transition-all duration-300 cursor-pointer",
                                    isCurrent && "size-20",
                                    !isCurrent && "size-16"
                                )}
                                onClick={() => {
                                    // Desktop: scroll to item
                                    // Mobile: open popup
                                    if (window.innerWidth < 768) {
                                        setMobilePopupIndex(index);
                                    } else {
                                        containerRef.current?.scrollTo({
                                            top: index * 128,
                                            behavior: "smooth",
                                        });
                                    }
                                }}
                            >
                                {/* Glow effects for active */}
                                {isCurrent && (
                                    <>
                                        <div className="absolute inset-0 rounded-full bg-[#98EB94]/20 animate-ping"></div>
                                        <div className="absolute -inset-3 rounded-full border-4 border-[#98EB94]/20"></div>
                                    </>
                                )}

                                {/* Main Circle */}
                                <div
                                    className={cn(
                                        "relative w-full h-full rounded-full flex items-center justify-center transition-all duration-300",
                                        isPast && "bg-primary border-2 border-primary shadow-md",
                                        isCurrent &&
                                        "bg-white dark:bg-gray-900 border-4 border-[#98EB94] shadow-[0_0_20px_rgba(152,235,148,0.4)]",
                                        isFuture && "bg-[#F2F2F7] border-2 border-[#F2F2F7]"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "material-symbols-outlined transition-all",
                                            isCurrent ? "!text-4xl text-[#98EB94]" : "!text-3xl",
                                            isPast && "text-white",
                                            isFuture && "text-[#787880] opacity-20"
                                        )}
                                    >
                                        {stage.icon}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Right Side Content Card - Desktop */}
                            {isFocused && (
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute left-[55%] pl-8 hidden md:block w-[450px]"
                                >
                                    <div
                                        className={cn(
                                            "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg relative transition-all duration-300",
                                            isCurrent
                                                ? "border-2 border-[#98EB94] scale-110 origin-left"
                                                : "border border-gray-200 dark:border-gray-700"
                                        )}
                                    >
                                        <h3
                                            className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-300"
                                        >
                                            {stage.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                                            {(() => {
                                                const latestAnnouncement = getLatestAnnouncement(stage.id);
                                                if (latestAnnouncement && isCurrent) {
                                                    return getAnnouncementPreview(latestAnnouncement);
                                                }
                                                return isCurrent
                                                    ? "Bu aşama şu an aktif. Henüz duyuru bulunmamaktadır."
                                                    : isPast
                                                        ? "Bu aşama başarıyla tamamlanmıştır."
                                                        : "Bu aşama henüz aktif değildir.";
                                            })()}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-400">22/01/2026</span>
                                                {isCurrent && (
                                                    <button
                                                        onClick={() => handleShare(stage)}
                                                        className="text-gray-400 hover:text-[#98EB94] transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                                        title="Duyuruyu Paylaş"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">share</span>
                                                    </button>
                                                )}
                                            </div>
                                            <Link
                                                href={`/asamalar/${stage.slug}`}
                                                className={cn(
                                                    "px-8 py-3 rounded-lg text-sm font-semibold transition-colors",
                                                    isCurrent || isPast
                                                        ? "bg-success hover:bg-green-700 text-white"
                                                        : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                                                )}
                                            >
                                                {isCurrent || isPast ? "Detayları Gör" : "Henüz Aktif Değil"}
                                            </Link>
                                        </div>

                                        {/* Connector line */}
                                        <div className="absolute -left-8 top-1/2 w-8 h-[2px] bg-gray-200 dark:bg-gray-700 -translate-y-1/2"></div>
                                        <div className="absolute -left-1 top-1/2 size-2 bg-gray-300 dark:bg-gray-600 rounded-full -translate-y-1/2"></div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Mobile Popup Modal */}
            <AnimatePresence>
                {mobilePopupIndex !== null && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="md:hidden fixed inset-0 bg-black/50 z-40"
                            onClick={() => setMobilePopupIndex(null)}
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className="md:hidden fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50"
                        >
                            <div
                                className={cn(
                                    "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl",
                                    STAGES[mobilePopupIndex].id === ACTIVE_STAGE_ID
                                        ? "border-2 border-[#98EB94]"
                                        : "border border-gray-200 dark:border-gray-700"
                                )}
                            >
                                {/* Close button */}
                                <button
                                    onClick={() => setMobilePopupIndex(null)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>

                                <h3
                                    className="text-xl font-bold mb-3 text-gray-700 dark:text-gray-300"
                                >
                                    {STAGES[mobilePopupIndex].title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                    {(() => {
                                        const latestAnnouncement = getLatestAnnouncement(STAGES[mobilePopupIndex].id);
                                        const isActiveStage = STAGES[mobilePopupIndex].id === ACTIVE_STAGE_ID;

                                        if (latestAnnouncement && isActiveStage) {
                                            return getAnnouncementPreview(latestAnnouncement);
                                        }
                                        return isActiveStage
                                            ? "Bu aşama şu an aktif. Henüz duyuru bulunmamaktadır."
                                            : mobilePopupIndex < activeStageIndex
                                                ? "Bu aşama başarıyla tamamlanmıştır."
                                                : "Bu aşama henüz aktif değildir.";
                                    })()}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-400">22/01/2026</span>
                                        {STAGES[mobilePopupIndex].id === ACTIVE_STAGE_ID && (
                                            <button
                                                onClick={() => handleShare(STAGES[mobilePopupIndex])}
                                                className="text-gray-400 hover:text-[#98EB94] transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                                title="Duyuruyu Paylaş"
                                            >
                                                <span className="material-symbols-outlined text-sm">share</span>
                                            </button>
                                        )}
                                    </div>
                                    <Link
                                        href={`/asamalar/${STAGES[mobilePopupIndex].slug}`}
                                        className={cn(
                                            "px-5 py-2 rounded-lg text-sm font-semibold transition-colors",
                                            STAGES[mobilePopupIndex].id === ACTIVE_STAGE_ID || mobilePopupIndex < activeStageIndex
                                                ? "bg-success hover:bg-green-700 text-white"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                                        )}
                                        onClick={(e) => {
                                            if (!(STAGES[mobilePopupIndex].id === ACTIVE_STAGE_ID || mobilePopupIndex < activeStageIndex)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        {STAGES[mobilePopupIndex].id === ACTIVE_STAGE_ID || mobilePopupIndex < activeStageIndex
                                            ? "Detayları Gör"
                                            : "Kilitli"}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
