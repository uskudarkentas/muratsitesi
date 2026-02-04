"use client";

import { useRef, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useTimelineContext } from "@/context/TimelineContext";


import { TIMELINE_CONSTANTS } from "@/lib/constants";
import { useTimelineScroll } from "@/hooks/useTimelineScroll";
import { useStepperWindow } from "@/hooks/useStepperWindow";
import { useStageShare } from "@/hooks/useStageShare";
import { TimelineItem } from "@/components/timeline/TimelineItem";
import { TimelineMobileModal } from "@/components/timeline/TimelineMobileModal";
import { StepperControls } from "@/components/timeline/StepperControls";

// Define Stage interface matching DB/Prisma model roughly
interface StageData {
    id: number;
    title: string;
    description: string | null;
    slug: string;
    iconKey: string;
    status: string;
    sequenceOrder: number;
    isVisible: boolean;
    variant?: string;
}

interface TimelineProps {
    stages: StageData[];
}

export default function Timeline({ stages }: TimelineProps) {
    const STAGES = stages; // Map prop to local variable to minimize code changes

    // Find the stage marked as ACTIVE in the database
    const dbActiveIndex = STAGES.findIndex(s => s.status === 'ACTIVE');
    const activeStageIndex = dbActiveIndex !== -1 ? dbActiveIndex : 0;
    const currentActiveStage = STAGES[activeStageIndex] || STAGES[0];

    const containerRef = useRef<HTMLDivElement>(null);
    const { focusedIndex, handleScroll, scrollToIndex } = useTimelineScroll(containerRef, activeStageIndex);
    const { handleShare } = useStageShare();
    const [mobilePopupIndex, setMobilePopupIndex] = useState<number | null>(null);

    // Context for Sidebar/Content sync
    const { setFocusedStageId } = useTimelineContext();

    // Sync focused stage ID to context
    useEffect(() => {
        if (STAGES[focusedIndex]) {
            setFocusedStageId(STAGES[focusedIndex].id);
        }
    }, [focusedIndex, setFocusedStageId]);

    // 2-1-2 Stepper Window Logic
    const { visibleStart, visibleEnd } = useStepperWindow(focusedIndex, STAGES.length);

    // Navigation handlers
    const handleNext = () => {
        if (focusedIndex < STAGES.length - 1) {
            scrollToIndex(focusedIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (focusedIndex > 0) {
            scrollToIndex(focusedIndex - 1);
        }
    };

    const handleJumpTo = (index: number) => {
        scrollToIndex(index);
    };

    return (
        <>
            <div className="relative w-full max-w-7xl mx-auto flex justify-center items-start">
                {/* Central Line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-700 z-0"></div>

                {/* Scrollable Container */}
                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="relative z-10 w-full overflow-y-auto no-scrollbar snap-y snap-mandatory"
                    style={{
                        height: `${TIMELINE_CONSTANTS.CONTAINER_HEIGHT_VH}dvh`,
                        paddingTop: `calc(${TIMELINE_CONSTANTS.CONTAINER_HEIGHT_VH / 2}dvh - ${TIMELINE_CONSTANTS.ITEM_HEIGHT_VH / 2}dvh)`, // Center in container
                        paddingBottom: `calc(${TIMELINE_CONSTANTS.CONTAINER_HEIGHT_VH / 2}dvh - ${TIMELINE_CONSTANTS.ITEM_HEIGHT_VH / 2}dvh)`,
                        scrollbarWidth: "none",
                        msOverflowStyle: "none"
                    }}
                >
                    <style jsx>{`
                      div::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>

                    {STAGES.map((stage, index) => {
                        const isFocused = focusedIndex === index;
                        const isCurrent = index === activeStageIndex;
                        const isPast = stage.status === 'COMPLETED';
                        const isFuture = stage.status === 'LOCKED';

                        // 2-1-2 Window visibility calculation
                        const isVisible = index >= visibleStart && index <= visibleEnd;
                        const distanceFromActive = index - focusedIndex;

                        return (
                            <TimelineItem
                                key={stage.id}
                                stage={stage}
                                index={index}
                                isFocused={isFocused}
                                isCurrent={isCurrent}
                                isPast={isPast}
                                isFuture={isFuture}
                                activeStageIndex={activeStageIndex}
                                onShare={handleShare}
                                onMobileClick={(clickedIndex) => setMobilePopupIndex(clickedIndex)}
                                onScrollTo={() => scrollToIndex(index)}
                                isVisible={isVisible}
                                distanceFromActive={distanceFromActive}
                            />
                        );
                    })}
                </div>

                {/* Mobile Popup Modal */}
                <AnimatePresence>
                    {mobilePopupIndex !== null && (
                        <TimelineMobileModal
                            stage={STAGES[mobilePopupIndex]}
                            onClose={() => setMobilePopupIndex(null)}
                            activeStageIndex={activeStageIndex}
                            onShare={handleShare}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Stepper Navigation Controls */}
            <StepperControls
                currentStep={focusedIndex}
                totalSteps={STAGES.length}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onJumpTo={handleJumpTo}
            />
        </>
    );
}
