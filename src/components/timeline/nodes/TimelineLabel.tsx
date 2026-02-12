import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getStageInputClassName } from "@/lib/stageHelpers";

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
                "w-[clamp(200px,30vw,350px)]",
                isCurrent && "font-bold",
                isPast && "text-gray-500",
                isFuture && "text-gray-300"
            )}
        >
            <div className="flex flex-col items-end">
                <span className={cn(
                    getStageInputClassName(isFocused),
                    isCurrent && "text-[#98EB94]"
                )}>
                    {stage.title}
                </span>
                <span className={cn(
                    "text-[10px] uppercase tracking-wider font-medium opacity-60 flex items-center gap-1",
                    isCurrent && "text-[#98EB94] opacity-100",
                    isPast && "text-gray-500",
                    isFuture && "text-gray-400"
                )}>
                    {isPast ? (
                        <>
                            Tamamlandı <span className="material-symbols-outlined !text-[12px]">check</span>
                        </>
                    ) : isCurrent ? (
                        <>
                            Süreç Devam Ediyor <span className="material-symbols-outlined !text-[12px] animate-spin-slow">sync</span>
                        </>
                    ) : (
                        <>
                            Sürece Başlanmadı <span className="material-symbols-outlined !text-[12px]">lock</span>
                        </>
                    )}
                </span>
            </div>
        </motion.div>
    );
}

export function MobileTimelineLabel({
    stage,
    isCurrent,
    isPast
}: Pick<TimelineLabelProps, 'stage' | 'isCurrent' | 'isPast'>) {
    return (
        <div className="md:hidden absolute right-1/2 mr-24 min-w-[140px] text-right pointer-events-none flex flex-col items-end gap-1 z-30">
            <span className={cn(
                "text-sm font-bold block leading-tight",
                isCurrent ? "text-[#98EB94]" : "text-gray-600 dark:text-gray-300"
            )}>
                {stage.title}
            </span>
            <span className={cn(
                "text-[8px] uppercase tracking-wider font-bold flex items-center gap-1",
                isCurrent ? "text-[#98EB94]" : "text-gray-400"
            )}>
                {isPast ? (
                    <>
                        Tamamlandı <span className="material-symbols-outlined !text-[10px]">check</span>
                    </>
                ) : isCurrent ? (
                    <>
                        Süreç Devam Ediyor <span className="material-symbols-outlined !text-[10px] animate-spin-slow">sync</span>
                    </>
                ) : (
                    <>
                        Sürece Başlanmadı <span className="material-symbols-outlined !text-[10px]">lock</span>
                    </>
                )}
            </span>
        </div>
    );
}
