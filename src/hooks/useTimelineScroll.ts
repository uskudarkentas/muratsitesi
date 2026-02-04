import { useState, useEffect, RefObject } from "react";
import { STAGES } from "@/lib/stages";
import { TIMELINE_CONSTANTS } from "@/lib/constants";

export function useTimelineScroll(
    containerRef: RefObject<HTMLDivElement | null>,
    initialIndex: number = 0,
    extraOffsetPx: number = 0 // Offset for elements like AddContentTrigger (e.g., 64 in Admin)
) {
    const [focusedIndex, setFocusedIndex] = useState(initialIndex);

    const getItemHeightPx = () => {
        if (typeof window === 'undefined') return 128; // Fallback
        // Base Item Height (vh) + Extra Offset (for admin triggers etc)
        return (window.innerHeight * (TIMELINE_CONSTANTS.ITEM_HEIGHT_VH / 100)) + extraOffsetPx;
    };

    const handleScroll = () => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const { scrollTop } = container;
        const itemHeight = getItemHeightPx();
        const calculatedIndex = Math.round(scrollTop / itemHeight);
        setFocusedIndex(calculatedIndex);
    };

    // Initial scroll to active stage
    useEffect(() => {
        if (containerRef.current) {
            // Small timeout to ensure DOM is ready and layout is stable
            setTimeout(() => {
                const itemHeight = getItemHeightPx();
                containerRef.current?.scrollTo({
                    top: initialIndex * itemHeight,
                    behavior: "instant",
                });
                setFocusedIndex(initialIndex);
            }, 100);
        }
    }, [containerRef, initialIndex]);

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
