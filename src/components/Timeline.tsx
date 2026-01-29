"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { STAGES } from "@/lib/stages";
import { TIMELINE_CONSTANTS } from "@/lib/constants";
import { useTimelineScroll } from "@/hooks/useTimelineScroll";
import { useStepperWindow } from "@/hooks/useStepperWindow";
import { useStageShare } from "@/hooks/useStageShare";
import { TimelineItem } from "@/components/timeline/TimelineItem";
import { TimelineMobileModal } from "@/components/timeline/TimelineMobileModal";
import { StepperControls } from "@/components/timeline/StepperControls";

export default function Timeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { focusedIndex, handleScroll, scrollToIndex } = useTimelineScroll(containerRef);
    const { handleShare } = useStageShare();
    const [mobilePopupIndex, setMobilePopupIndex] = useState<number | null>(null);

    const activeStageIndex = STAGES.findIndex((s) => s.id === TIMELINE_CONSTANTS.ACTIVE_STAGE_ID);

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
                        const isCurrent = stage.id === TIMELINE_CONSTANTS.ACTIVE_STAGE_ID;
                        const isPast = stage.id < TIMELINE_CONSTANTS.ACTIVE_STAGE_ID;
                        const isFuture = stage.id > TIMELINE_CONSTANTS.ACTIVE_STAGE_ID;

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
                            stageIndex={mobilePopupIndex}
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
