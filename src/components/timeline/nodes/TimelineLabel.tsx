import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getStageInputClassName } from "@/lib/stageHelpers";
import { extractHeroContent } from "@/lib/stageUtils";
import Link from "next/link";

interface TimelineLabelProps {
    stage: any;
    isFocused: boolean;
    isCurrent: boolean;
    isPast: boolean;
    isFuture: boolean;
}

export function TimelineLabel({
    stage,
    isFocused,
    isCurrent,
    isPast,
    isFuture
}: TimelineLabelProps) {
    const heroContent = extractHeroContent(stage.content);
    const displayTitle = heroContent?.title ? heroContent.title.replace(/<[^>]*>/g, '') : stage.title;
    const displayDescription = heroContent?.description ? heroContent.description.replace(/<[^>]*>/g, '') : null;

    return (
        <motion.div
            animate={{
                opacity: isFocused ? 1 : 0.5,
                x: isFocused ? 0 : 20,
            }}
            className={cn(
                "absolute transition-all duration-300",
                "hidden md:block", // Hide on mobile, show only center icon + modal
                "right-1/2 mr-24", // Fixed offset from center (matches card spacing)
                "text-right",
                "w-[clamp(250px,35vw,400px)]",
                isCurrent && "font-bold",
                isPast && "text-gray-600",
                isFuture && "text-gray-300"
            )}
        >
            <div className="flex flex-col items-end gap-3">
                {/* Badge/Status */}
                <span className={cn(
                    "text-[10px] uppercase tracking-widest font-black opacity-60 flex items-center gap-2",
                    isCurrent && "text-[#ed2630] opacity-100",
                    isPast && "text-[#ed2630]/60",
                    isFuture && "text-gray-400"
                )}>
                    {isPast ? (
                        <>
                            TAMAMLANDI <span className="w-1.5 h-1.5 rounded-full bg-[#ed2630]/40"></span>
                        </>
                    ) : isCurrent ? (
                        <>
                            AKTİF SÜREÇ <span className="w-1.5 h-1.5 rounded-full bg-[#ed2630] animate-pulse"></span>
                        </>
                    ) : (
                        <>
                            GELECEK ADIM <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        </>
                    )}
                </span>

                {/* Title */}
                <span className={cn(
                    getStageInputClassName(isFocused),
                    isCurrent && "text-[#1a1b1f] dark:text-white",
                    "block leading-tight"
                )}>
                    {displayTitle}
                </span>

                {/* Description - Always visible for current/past */}
                {(isCurrent || isPast) && displayDescription && (
                    <p className={cn(
                        "text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed max-w-[320px] ml-auto mb-2",
                        !isFocused && "opacity-70" // Slightly dimmed when not focused but still visible
                    )}>
                        {displayDescription}
                    </p>
                )}

                {/* Action Button - Always visible for current/past */}
                {(isCurrent || isPast) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Link
                            href={`/asamalar/${stage.slug}`}
                            className={cn(
                                "inline-flex items-center gap-2 px-6 py-2 bg-[#ed2630] hover:bg-[#d91e28] text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20",
                                !isFocused && "opacity-80"
                            )}
                        >
                            DETAYLARI GÖR
                            <span className="material-symbols-outlined !text-sm">arrow_forward</span>
                        </Link>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

export function MobileTimelineLabel({
    stage,
    isCurrent,
    isPast
}: Pick<TimelineLabelProps, 'stage' | 'isCurrent' | 'isPast'>) {
    const heroContent = extractHeroContent(stage.content);
    const displayTitle = heroContent?.title ? heroContent.title.replace(/<[^>]*>/g, '') : stage.title;

    return (
        <div className="md:hidden absolute right-1/2 mr-20 min-w-[140px] text-right pointer-events-none flex flex-col items-end gap-1 z-30">
            <span className={cn(
                "text-xs font-black uppercase tracking-widest block leading-tight",
                isCurrent ? "text-[#ed2630]" : isPast ? "text-[#ed2630]/60" : "text-gray-400"
            )}>
                {isPast ? "TAMAMLANDI" : isCurrent ? "AKTİF" : "KİLİTLİ"}
            </span>
            <span className={cn(
                "text-sm font-bold block leading-tight max-w-[120px]",
                isCurrent ? "text-slate-900 dark:text-white" : "text-gray-600 dark:text-gray-300"
            )}>
                {displayTitle}
            </span>
        </div>
    );
}
