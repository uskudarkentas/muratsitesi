"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { TIMELINE_CONSTANTS } from "@/lib/constants";

interface TimelineContextType {
    focusedStageId: number;
    setFocusedStageId: (id: number) => void;
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export function TimelineProvider({ children }: { children: ReactNode }) {
    // Default will be synced from AdminTimeline on load
    const [focusedStageId, setFocusedStageId] = useState<number>(1);

    return (
        <TimelineContext.Provider value={{ focusedStageId, setFocusedStageId }}>
            {children}
        </TimelineContext.Provider>
    );
}

export function useTimelineContext() {
    const context = useContext(TimelineContext);
    if (context === undefined) {
        throw new Error("useTimelineContext must be used within a TimelineProvider");
    }
    return context;
}
