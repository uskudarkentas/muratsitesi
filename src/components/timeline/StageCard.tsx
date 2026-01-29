import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCardClassName, getStageDescription } from "@/lib/stageHelpers";
import { Stage } from "@/lib/stages";
import { DynamicStageCard } from "@/components/DynamicStageCard";

interface StageCardProps {
    stage: Stage;
    isCurrent: boolean;
    isPast: boolean;
    activeStageIndex: number;
    onShare: (stage: any) => void;
    variant?: 'desktop' | 'mobile';
    mobileIndex?: number;
}

export function StageCard({
    stage,
    isCurrent,
    isPast,
    activeStageIndex,
    onShare,
    variant = 'desktop',
    mobileIndex
}: StageCardProps) {

    // For mobile, we might pass an index for the description logic
    const description = getStageDescription(stage.id, isCurrent, isPast, activeStageIndex, mobileIndex);

    // Desktop wrapper styles are handled in TimelineItem usually, but here we define the inner card content
    // For desktop this component renders the CARD itself.

    const containerClass = variant === 'mobile'
        ? cn(
            "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl",
            isCurrent ? "border-2 border-[#98EB94]" : "border border-gray-200 dark:border-gray-700"
        )
        : getCardClassName(isCurrent);

    return (
        <div className={containerClass}>
            {variant === 'mobile' && (
                <button className="absolute top-4 right-4 text-gray-400 opacity-0 pointer-events-none">
                    {/* Placeholder for layout if needed, actual close button is in modal wrapper */}
                </button>
            )}

            {/* Dynamic Content for Desktop */}
            {variant === 'desktop' ? (
                <DynamicStageCard key={stage.id} stageId={stage.id} />
            ) : (
                // Mobile View (Simple Summary)
                <>
                    <h3 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-300">
                        {stage.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                        {description}
                    </p>
                </>
            )}

            {/* Actions / Buttons - Kept for both but logic might need adjustment if DynamicStageCard has its own */}
            {/* DynamicStageCard handles its own content. But maybe we keep the link button for "Details"? */}
            {/* User request: "Content Panel" (Desktop) should use fetch logic. 
                DynamicStageCard renders Title + Date + RichText. 
                So for desktop, we might NOT want the original Title/Description/Button layout exactly as before.
                Current implementation of DynamicStageCard includes Title and Date.
                
                However, for the Detail Link ("Detayları Gör"), it is still relevant.
                I will append the "Detayları Gör" button BELOW the DynamicStageCard content if desktop.
            */}

            <div className="flex items-center justify-between mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                {/* Share Button Logic - Mobile mostly, Desktop has it in rich text? 
                     User said: "For Images: Add share". But main card sharing is good too.
                 */}
                <div className="flex items-center gap-3">
                    {!isCurrent && variant === 'desktop' && (
                        <span className="text-xs text-gray-400">Daha eski duyurular için detaya gidiniz</span>
                    )}
                    {isCurrent && variant === 'mobile' && (
                        <button
                            onClick={() => onShare(stage)}
                            className="text-gray-400 hover:text-[#98EB94] transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                            title="Duyuruyu Paylaş"
                        >
                            <span className="material-symbols-outlined text-sm">share</span>
                        </button>
                    )}
                </div>

                {/* Logic for button state */}
                <Link
                    href={`/asamalar/${stage.slug}`}
                    className={cn(
                        "px-8 py-3 rounded-lg text-sm font-semibold transition-colors",
                        (variant === 'mobile'
                            ? (isCurrent || (mobileIndex !== undefined && mobileIndex < activeStageIndex))
                            : (isCurrent || isPast)
                        )
                            ? "bg-success hover:bg-green-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                    )}
                    onClick={(e) => {
                        const allow = variant === 'mobile'
                            ? (isCurrent || (mobileIndex !== undefined && mobileIndex < activeStageIndex))
                            : (isCurrent || isPast);
                        if (!allow) e.preventDefault();
                    }}
                >
                    {(() => {
                        const allow = variant === 'mobile'
                            ? (isCurrent || (mobileIndex !== undefined && mobileIndex < activeStageIndex))
                            : (isCurrent || isPast);
                        return allow ? "Tüm Detayları Gör" : (variant === 'mobile' ? "Kilitli" : "Henüz Aktif Değil");
                    })()}
                </Link>
            </div>

            {/* Desktop Connectors - Removed as handled in TimelineItem */}
            {variant === 'desktop' && null}
        </div>
    );
}
