import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StageCard } from "./StageCard";
import { getStageInputClassName } from "@/lib/stageHelpers";
import { TIMELINE_CONSTANTS } from "@/lib/constants";

interface TimelineItemProps {
    stage: any;
    index: number;
    isFocused: boolean;
    isCurrent: boolean;
    isPast: boolean;
    isFuture: boolean;
    activeStageIndex: number;
    onShare: (stage: any) => void;
    onMobileClick: (index: number) => void;
    onScrollTo: () => void;
    // 2-1-2 Window props
    isVisible?: boolean;           // Is within visible window
    distanceFromActive?: number;   // Distance from active step (for depth)
}

export function TimelineItem({
    stage,
    index,
    isFocused,
    isCurrent,
    isPast,
    isFuture,
    activeStageIndex,
    onShare,
    onMobileClick,
    onScrollTo,
    isVisible = true,
    distanceFromActive = 0
}: TimelineItemProps) {
    // Calculate depth-based scale and opacity (2-1-2 pattern)
    const getDepthScale = () => {
        if (!isVisible) return 0.3;
        if (isFocused) return 1;
        const absDistance = Math.abs(distanceFromActive);
        return Math.max(0.6, 1 - (absDistance * 0.15)); // Reduce scale by 15% per step
    };

    const getDepthOpacity = () => {
        if (!isVisible) return 0;
        if (isFocused) return 1;
        const absDistance = Math.abs(distanceFromActive);
        return Math.max(0.3, 1 - (absDistance * 0.2)); // Reduce opacity by 20% per step
    };

    return (
        <motion.div
            className={`w-full flex justify-center items-center snap-center relative`}
            style={{ height: `${TIMELINE_CONSTANTS.ITEM_HEIGHT_VH}dvh` }}
            animate={{
                scale: getDepthScale(),
                opacity: getDepthOpacity(),
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {/* Left Side Label */}
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
                <span className={cn(
                    getStageInputClassName(isFocused),
                    isCurrent && "text-[#98EB94]"
                )}>
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
                    if (window.innerWidth < 768) {
                        onMobileClick(index);
                    } else {
                        onScrollTo();
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
                    className="absolute left-[55%] pl-8 hidden md:block w-[clamp(300px,35vw,450px)]"
                >
                    <StageCard
                        stage={stage}
                        isCurrent={isCurrent}
                        isPast={isPast}
                        activeStageIndex={activeStageIndex}
                        onShare={onShare}
                        variant="desktop"
                    />
                </motion.div>
            )}
        </motion.div>
    );
}
