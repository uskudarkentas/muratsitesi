import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineNodeProps {
    stage: any;
    index: number;
    isFocused: boolean;
    isCurrent: boolean;
    isPast: boolean;
    isFuture: boolean;
    isAdmin?: boolean;
    onMobileClick: (index: number) => void;
    onScrollTo: () => void;
    onDelete?: () => void;
    onComplete?: (id: number) => void;
}

export function TimelineNode({
    stage,
    index,
    isFocused,
    isCurrent,
    isPast,
    isFuture,
    isAdmin,
    onMobileClick,
    onScrollTo,
    onDelete,
    onComplete
}: TimelineNodeProps) {
    const isSmallVariant = stage.variant === 'small' || stage.slug === 'temsili-sozlesme';

    return (
        <motion.div
            animate={{
                scale: isCurrent && isFocused ? 1.5 : isFocused ? 1.2 : 1,
            }}
            className={cn(
                "relative flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer group z-30",
                isSmallVariant
                    ? "size-10" // Consistently match meeting node size
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
            {isAdmin && (
                <>
                    {/* Delete Button */}
                    {onDelete && (
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

                    {/* Complete Button (Only for Active Stage) */}
                    {isCurrent && onComplete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onComplete(stage.id);
                            }}
                            className="absolute -bottom-3 -right-3 z-[60] bg-[#98EB94] text-slate-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-[#7dd979] hover:scale-110"
                            title="Aşamayı Tamamla"
                        >
                            <span className="material-symbols-outlined !text-xl leading-none">check_circle</span>
                        </button>
                    )}
                </>
            )}

            {/* Glow effects for active */}
            {isCurrent && (
                <>
                    <div className={cn(
                        "absolute inset-0 rounded-full animate-ping",
                        isSmallVariant ? "bg-red-200" : "bg-[#98EB94]/20"
                    )}></div>
                    <div className={cn(
                        "absolute -inset-3 rounded-full border-4",
                        isSmallVariant ? "border-red-200" : "border-[#98EB94]/20"
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
                    isSmallVariant && "!bg-[#FCD535] !border-none !shadow-sm", // Solid Yellow/Gold
                    isSmallVariant && isCurrent && "shadow-[0_0_20px_rgba(252,213,53,0.6)] scale-110" // Gold glow if active
                )}
            >
                <span className="relative z-10 flex items-center justify-center">
                    <span
                        className={cn(
                            "material-symbols-outlined transition-all leading-none",
                            isSmallVariant
                                ? "text-white text-lg" // specific size for small
                                : (isCurrent ? "text-[#34C759] text-3xl" : (isFuture ? "text-slate-400 text-2xl" : "text-white text-2xl")),
                            isCurrent && !isSmallVariant && "scale-110",
                            isSmallVariant && "text-white" // ensure white icon on gold
                        )}
                        style={isSmallVariant ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                        {isSmallVariant ? 'star' : (stage.icon || stage.iconKey)}
                    </span>
                </span>
            </div>
        </motion.div>
    );
}
