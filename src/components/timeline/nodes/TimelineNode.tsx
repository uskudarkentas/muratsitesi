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

    // Check for specific color variants
    const isGoldVariant = stage.slug === 'temsili-sozlesme';
    const isGreenVariant = stage.slug === 'riskli-yapi-ilani';

    // Helper to determine active color based on variant
    const getActiveColorClass = (type: 'text' | 'bg' | 'border' | 'shadow' | 'ping') => {
        if (isGoldVariant) {
            switch (type) {
                case 'text': return 'text-white';
                case 'bg': return 'bg-[#FCD535]';
                case 'border': return 'border-[#FCD535]';
                case 'shadow': return 'shadow-[0_0_20px_rgba(252,213,53,0.6)]';
                case 'ping': return 'bg-[#FCD535]/50';
            }
        }
        if (isGreenVariant) {
            switch (type) {
                case 'text': return 'text-[#98EB94]';
                case 'bg': return 'bg-[#98EB94]/20';
                case 'border': return 'border-[#98EB94]';
                case 'shadow': return 'shadow-[0_0_20px_rgba(152,235,148,0.4)]';
                case 'ping': return 'bg-[#98EB94]/20';
            }
        }
        // Default Red
        switch (type) {
            case 'text': return 'text-[#ed2630]';
            case 'bg': return 'bg-[#ed2630]/20';
            case 'border': return 'border-[#ed2630]';
            case 'shadow': return 'shadow-[0_0_20px_rgba(237,38,48,0.4)]';
            case 'ping': return 'bg-[#ed2630]/20';
        }
    };

    return (
        <motion.div
            animate={{
                scale: isCurrent && isFocused ? 1.5 : isFocused ? 1.2 : 1,
            }}
            className={cn(
                "relative flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer group z-30",
                isSmallVariant
                    ? "size-10" // Consistently match meeting node size
                    : (isCurrent ? "size-20" : isPast ? "size-12" : "size-16"), // Smaller for past, standard for future

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
                        isSmallVariant ? "bg-red-200" : getActiveColorClass('ping')
                    )}></div>
                    <div className={cn(
                        "absolute -inset-3 rounded-full border-4",
                        isSmallVariant ? "border-red-200" :
                            (isGoldVariant ? "border-[#FCD535]/50" :
                                (isGreenVariant ? "border-[#34C759]/20" : "border-[#ed2630]/20"))
                    )}></div>
                </>
            )}

            {/* Main Circle */}
            <div
                className={cn(
                    "relative w-full h-full rounded-full flex items-center justify-center transition-all duration-300",

                    // Base colors: Solid colors for past items (as requested: "daire kırmızı iconlar beyazdı")
                    isPast && !isGoldVariant && !isGreenVariant && "bg-[#ed2630] border-2 border-[#ed2630] shadow-md",

                    // Active State Logic: Pulsing and Highlighted
                    (isCurrent || stage.status === 'ACTIVE') && !isGoldVariant && cn(
                        "bg-white dark:bg-gray-900 border-4",
                        getActiveColorClass('border'),
                        getActiveColorClass('shadow')
                    ),

                    // Future State Logic: Gray for locked items that aren't past the active marker
                    (isFuture && stage.status !== 'COMPLETED' && stage.status !== 'ACTIVE') && "bg-[#F2F2F7] border-2 border-[#F2F2F7]",

                    // Overrides for Gold variants (Temsili Sözleşme)
                    isGoldVariant && (isPast ? "bg-[#FCD535] border-2 border-[#FCD535]" : "!bg-[#FCD535] !border-none !shadow-sm"),
                    isGoldVariant && (isCurrent || stage.status === 'ACTIVE') && "bg-white border-4 border-[#FCD535] shadow-[0_0_20px_rgba(252,213,53,0.8)] scale-110 shadow-gold/20"
                )}
            >
                <span className="relative z-10 flex items-center justify-center">
                    <span
                        className={cn(
                            "material-symbols-outlined transition-all leading-none",
                            isSmallVariant
                                ? "text-white text-lg" // specific size for small
                                : (isCurrent || stage.status === 'ACTIVE'
                                    ? `${getActiveColorClass('text')} text-3xl`
                                    : (isPast || stage.status === 'COMPLETED')
                                        ? "text-white text-xl"
                                        : isFuture && stage.status !== 'COMPLETED' ? "text-slate-400 text-2xl" : "text-white text-2xl"),
                            (isCurrent || stage.status === 'ACTIVE') && !isSmallVariant && "scale-110",
                            isGoldVariant && !isPast && !isCurrent && "text-white" // solid gold items have white icons
                        )}
                        style={isGoldVariant ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                        {isSmallVariant ? 'star' : (stage.icon || stage.iconKey)}
                    </span>
                </span>
            </div>
        </motion.div >
    );
}
