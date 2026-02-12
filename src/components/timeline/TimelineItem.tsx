import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StageCard } from "./StageCard";
import { TIMELINE_CONSTANTS } from "@/lib/constants";
import { TimelineNode } from "./nodes/TimelineNode";
import { MeetingNode } from "./nodes/MeetingNode";
import { TimelineLabel, MobileTimelineLabel } from "./nodes/TimelineLabel";

interface TimelineItemProps {
    stage: any;
    index: number;
    isFocused: boolean;
    isCurrent: boolean;
    isPast: boolean;
    isFuture: boolean;
    activeStageIndex: number;
    onShare: (stage: any) => void;
    onMobileClick: (index: number) => void;
    onScrollTo: () => void;
    // 2-1-2 Window props
    isVisible?: boolean;           // Is within visible window
    distanceFromActive?: number;   // Distance from active step (for depth)
    isAdmin?: boolean;
    onDelete?: () => void;
    onComplete?: (id: number) => void;
    onEditPost?: (post: any) => void;
    onDeletePost?: (postId: string) => void;
    onMeetingClick?: (meeting: any) => void;
}

export function TimelineItem({
    stage,
    index,
    isFocused,
    isCurrent,
    isPast,
    isFuture,
    activeStageIndex,
    onShare,
    onMobileClick,
    onScrollTo,
    isVisible = true,
    distanceFromActive = 0,
    isAdmin = false,
    onDelete,
    onComplete,
    onEditPost,
    onDeletePost,
    onMeetingClick,
}: TimelineItemProps) {
    // Calculate depth-based scale and opacity (2-1-2 pattern)
    const getDepthScale = () => {
        if (!isVisible) return 0.3;
        if (isFocused) return 1;
        const absDistance = Math.abs(distanceFromActive);
        return Math.max(0.6, 1 - (absDistance * 0.15)); // Reduce scale by 15% per step
    };

    const getDepthOpacity = () => {
        if (!isVisible) return 0;
        if (isAdmin) return 1; // Admin mode: always visible
        if (isFocused) return 1;
        const absDistance = Math.abs(distanceFromActive);
        return Math.max(0.3, 1 - (absDistance * 0.2)); // Reduce opacity by 20% per step
    };

    return (
        <motion.div
            className={`w-full flex justify-center items-center snap-center relative`}
            style={{ height: `${TIMELINE_CONSTANTS.ITEM_HEIGHT_VH}dvh` }}
            animate={{
                scale: getDepthScale(),
                opacity: getDepthOpacity(),
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {/* Left Side Label */}
            <TimelineLabel
                stage={stage}
                isFocused={isFocused}
                isCurrent={isCurrent}
                isPast={isPast}
                isFuture={isFuture}
            />

            {/* Mobile Title - Side positioned */}
            <MobileTimelineLabel
                stage={stage}
                isCurrent={isCurrent}
                isPast={isPast}
            />

            {/* Center Icon Circle */}
            <div className="absolute left-1/2 -translate-x-1/2 w-20 flex justify-center items-center h-full z-20">
                {/* Main Stage Node - Always centered in the TimelineItem row */}
                <TimelineNode
                    stage={stage}
                    index={index}
                    isFocused={isFocused}
                    isCurrent={isCurrent}
                    isPast={isPast}
                    isFuture={isFuture}
                    isAdmin={isAdmin}
                    onMobileClick={onMobileClick}
                    onScrollTo={onScrollTo}
                    onDelete={onDelete}
                    onComplete={onComplete}
                />

                {/* Meeting Nodes (Purple Stars) - Positioned at the bottom of the stage cell, centered between stages */}
                <div className="absolute top-[calc(50%+12.5dvh)] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                    {stage.meetings?.map((meeting: any) => (
                        <MeetingNode
                            key={meeting.id}
                            meeting={meeting}
                            stageSlug={stage.slug}
                            isAdmin={isAdmin}
                            onMeetingClick={onMeetingClick}
                            onEditPost={onEditPost}
                            onDeletePost={onDeletePost}
                        />
                    ))}
                </div>
            </div>

            {/* Right Side Content Card - Desktop - Hidden in Admin Mode */}
            {/* Persistent Content Logic: Show for Active/Past Stages if ANY content exists */}
            {isFocused && !isAdmin && (!isFuture && stage.latestPost) && (
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-1/2 ml-24 hidden md:block w-[clamp(300px,35vw,450px)]"
                >
                    {/* Connector Line to Card */}
                    <div className="absolute -left-24 top-1/2 w-24 h-[2px] bg-gray-200 dark:bg-gray-700 -translate-y-1/2 pointer-events-none -z-10"></div>

                    <StageCard
                        stage={{ ...stage, latestPost: stage.latestPost }} // Pass latestPost explicitly or merged
                        isCurrent={isCurrent}
                        isPast={isPast}
                        activeStageIndex={activeStageIndex}
                        onShare={onShare}
                        variant="desktop"
                    />
                </motion.div>
            )}
        </motion.div>
    );
}
