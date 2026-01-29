import { useState, useEffect, RefObject } from "react";
import { STAGES } from "@/lib/stages";
import { TIMELINE_CONSTANTS } from "@/lib/constants";

export function useTimelineScroll(containerRef: RefObject<HTMLDivElement | null>) {
    const [focusedIndex, setFocusedIndex] = useState(0);

    const getItemHeightPx = () => {
        if (typeof window === 'undefined') return 128; // Fallback
        return window.innerHeight * (TIMELINE_CONSTANTS.ITEM_HEIGHT_VH / 100);
    };

    const handleScroll = () => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const { scrollTop } = container;
        const itemHeight = getItemHeightPx();
        const calculatedIndex = Math.round(scrollTop / itemHeight);
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
                    const itemHeight = getItemHeightPx();
                    containerRef.current?.scrollTo({
                        top: activeStageIndex * itemHeight,
                        behavior: "instant",
                    });
                    setFocusedIndex(activeStageIndex);
                }, 100);
            }
        }
    }, [containerRef]);

    const scrollToIndex = (index: number) => {
        if (containerRef.current) {
            const itemHeight = getItemHeightPx();
            containerRef.current.scrollTo({
                top: index * itemHeight,
                behavior: "smooth",
            });
        }
    };

    return { focusedIndex, handleScroll, scrollToIndex };
}
