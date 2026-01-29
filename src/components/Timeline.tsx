"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { STAGES } from "@/lib/stages";
import { TIMELINE_CONSTANTS } from "@/lib/constants";
import { useTimelineScroll } from "@/hooks/useTimelineScroll";
import { useStageShare } from "@/hooks/useStageShare";
import { TimelineItem } from "@/components/timeline/TimelineItem";
import { TimelineMobileModal } from "@/components/timeline/TimelineMobileModal";

export default function Timeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { focusedIndex, handleScroll } = useTimelineScroll(containerRef);
    const { handleShare } = useStageShare();
    const [mobilePopupIndex, setMobilePopupIndex] = useState<number | null>(null);

    const activeStageIndex = STAGES.findIndex((s) => s.id === TIMELINE_CONSTANTS.ACTIVE_STAGE_ID);

    return (
        <div className="relative w-full max-w-7xl mx-auto flex justify-center items-start">
            {/* Central Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-700 z-0"></div>

            {/* Scrollable Container */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="relative z-10 w-full overflow-y-auto no-scrollbar snap-y snap-mandatory"
                style={{
                    height: TIMELINE_CONSTANTS.CONTAINER_HEIGHT,
                    paddingTop: TIMELINE_CONSTANTS.PADDING_VERTICAL,
                    paddingBottom: TIMELINE_CONSTANTS.PADDING_VERTICAL,
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
                            containerRef={containerRef}
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
    );
}
