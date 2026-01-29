import { useState, useEffect, RefObject } from "react";
import { STAGES } from "@/lib/stages";
import { TIMELINE_CONSTANTS } from "@/lib/constants";

export function useTimelineScroll(containerRef: RefObject<HTMLDivElement | null>) {
    const [focusedIndex, setFocusedIndex] = useState(0);

    const handleScroll = () => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const { scrollTop } = container;
        const calculatedIndex = Math.round(scrollTop / TIMELINE_CONSTANTS.ITEM_HEIGHT);
        const index = Math.max(0, Math.min(STAGES.length - 1, calculatedIndex));
        setFocusedIndex(index);
    };

    // Initial scroll to active stage
    useEffect(() => {
        if (containerRef.current) {
            const activeStageIndex = STAGES.findIndex((s) => s.id === TIMELINE_CONSTANTS.ACTIVE_STAGE_ID);
            if (activeStageIndex !== -1) {
                // Small timeout to ensure DOM is ready and layout is stable
                setTimeout(() => {
                    containerRef.current?.scrollTo({
                        top: activeStageIndex * TIMELINE_CONSTANTS.ITEM_HEIGHT,
                        behavior: "instant",
                    });
                    setFocusedIndex(activeStageIndex);
                }, 100);
            }
        }
    }, [containerRef]);

    return { focusedIndex, handleScroll };
}
