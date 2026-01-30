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
    isAdmin?: boolean;
    onDelete?: () => void;
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
    distanceFromActive = 0,
    isAdmin = false,
    onDelete,
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
        if (isAdmin) return 1; // Admin mode: always visible
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

                    {isPast && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-1 justify-end text-[#98EB94] text-sm mt-1 font-bold"
                        >
                            <span>Tamamlandı</span>
                            <span className="material-symbols-outlined !text-sm">check</span>
                        </motion.div>
                    )}
                    {isCurrent && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-1 justify-end text-[#98EB94] text-xs mt-1 font-medium"
                        >
                            <span>Süreç Devam Ediyor</span>
                            <span className="material-symbols-outlined !text-sm animate-spin">sync</span>
                        </motion.div>
                    )}
                    {isFuture && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-1 justify-end text-gray-400 text-xs mt-1 font-medium"
                        >
                            <span>Sürece Başlanmadı</span>
                            <span className="material-symbols-outlined !text-sm">lock</span>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Mobile Title & Status - Side positioned (Left side like Desktop) */}
            <div className="md:hidden absolute right-1/2 mr-24 min-w-[140px] text-right pointer-events-none flex flex-col items-end gap-1 z-30">
                <span className={cn(
                    "text-sm font-bold block leading-tight",
                    isCurrent ? "text-[#98EB94]" : "text-gray-600 dark:text-gray-300"
                )}>
                    {stage.title}
                </span>

                {/* Mobile Status Badge */}
                {isPast && (
                    <span className="text-[10px] font-bold text-[#98EB94] flex items-center gap-1">
                        Tamamlandı
                        <span className="material-symbols-outlined !text-[12px]">check</span>
                    </span>
                )}
                {isCurrent && (
                    <span className="text-[10px] font-bold text-[#98EB94] flex items-center gap-1">
                        Süreç Devam Ediyor
                        <span className="material-symbols-outlined !text-[12px] animate-spin">sync</span>
                    </span>
                )}
                {/* Future State - Added as requested */}
                {isFuture && (
                    <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        Sürece Başlanmadı
                        <span className="material-symbols-outlined !text-[12px]">lock</span>
                    </span>
                )}
            </div>

            {/* Center Icon Circle */}
            <motion.div
                animate={{
                    scale: isCurrent && isFocused ? 1.5 : isFocused ? 1.2 : 1,
                }}
                className={cn(
                    "relative flex items-center justify-center rounded-full z-20 transition-all duration-300 cursor-pointer group",
                    stage.variant === 'small'
                        ? (isCurrent ? "size-14" : "size-10") // Smaller sizes for 'small' variant (Temsili Sözleşme)
                        : (isCurrent ? "size-20" : "size-16"), // Standard sizes

                    // Admin Future Visibility Override
                    isAdmin && isFuture && "!bg-slate-200 !border-slate-400 !text-slate-600 border-2 border-dashed shadow-none"
                )}
                onClick={() => {
                    if (window.innerWidth < 768) {
                        onMobileClick(index);
                    } else {
                        onScrollTo();
                    }
                }}
            >
                {/* Admin Controls */}
                {isAdmin && onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(); // Trigger parent handler (which opens modal)
                        }}
                        className="absolute -top-3 -right-3 z-[60] bg-red-500 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110"
                        title="Aşamayı Sil"
                    >
                        <span className="material-symbols-outlined !text-xl leading-none">delete</span>
                    </button>
                )}

                {/* Glow effects for active */}
                {isCurrent && (
                    <>
                        <div className={cn(
                            "absolute inset-0 rounded-full animate-ping",
                            stage.variant === 'small' ? "bg-red-200" : "bg-[#98EB94]/20"
                        )}></div>
                        <div className={cn(
                            "absolute -inset-3 rounded-full border-4",
                            stage.variant === 'small' ? "border-red-200" : "border-[#98EB94]/20"
                        )}></div>
                    </>
                )}

                {/* Main Circle */}
                <div
                    className={cn(
                        "relative w-full h-full rounded-full flex items-center justify-center transition-all duration-300",
                        // Base colors
                        isPast && "bg-primary border-2 border-primary shadow-md",
                        isCurrent && "bg-white dark:bg-gray-900 border-4 border-[#98EB94] shadow-[0_0_20px_rgba(152,235,148,0.4)]",
                        isFuture && "bg-[#F2F2F7] border-2 border-[#F2F2F7]",

                        // Overrides for 'small' variant (Temsili Sözleşme) - GOLD STYLE
                        stage.variant === 'small' && "!bg-[#FCD535] !border-none !shadow-sm", // Solid Yellow/Gold
                        stage.variant === 'small' && isCurrent && "shadow-[0_0_20px_rgba(252,213,53,0.6)] scale-110" // Gold glow if active
                    )}
                >
                    <span
                        className={cn(
                            "material-symbols-outlined transition-all",
                            // Size logic
                            isCurrent ? "!text-4xl" : "!text-3xl",
                            stage.variant === 'small' && "!text-xl", // Fixed small size for icon

                            // Color logic
                            isCurrent && "text-[#98EB94]",
                            isPast && "text-white",
                            isFuture && "text-[#787880] opacity-20",

                            // Variant overrides
                            stage.variant === 'small' && "!text-white" // Always white text on gold bg
                        )}
                        style={stage.variant === 'small' ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                        {stage.icon || stage.iconKey}
                    </span>
                </div>
            </motion.div>

            {/* Right Side Content Card - Desktop */}
            {isFocused && (
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-1/2 ml-24 hidden md:block w-[clamp(300px,35vw,450px)]"
                >
                    {/* Connector Line to Card */}
                    <div className="absolute -left-24 top-1/2 w-24 h-[2px] bg-gray-200 dark:bg-gray-700 -translate-y-1/2 pointer-events-none -z-10"></div>

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
