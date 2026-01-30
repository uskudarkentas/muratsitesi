"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTimelineContext } from "@/context/TimelineContext";
import { deleteStage } from "@/actions/admin";


import { TIMELINE_CONSTANTS } from "@/lib/constants";
import { useTimelineScroll } from "@/hooks/useTimelineScroll";
import { useStepperWindow } from "@/hooks/useStepperWindow";
import { useStageShare } from "@/hooks/useStageShare";
import { TimelineItem } from "@/components/timeline/TimelineItem";
import { TimelineMobileModal } from "@/components/timeline/TimelineMobileModal";
import { StepperControls } from "@/components/timeline/StepperControls";
import { AddContentTrigger } from "@/components/admin/AddContentTrigger";
import { SimplifiedAnnouncementModal } from "@/components/admin/SimplifiedAnnouncementModal";

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

interface AdminTimelineProps {
    stages: StageData[];
    // Removed initialAction/Type props in favor of useSearchParams
}

export default function AdminTimeline({ stages }: AdminTimelineProps) {
    const searchParams = useSearchParams();
    const initialAction = searchParams.get('action');
    const initialType = searchParams.get('type');

    console.log("DEBUG: AdminTimeline - SearchParams:", {
        action: initialAction,
        type: initialType,
        hasSearchParams: !!searchParams
    });

    const STAGES = stages; // Map prop to local variable

    const containerRef = useRef<HTMLDivElement>(null);
    const { focusedIndex, handleScroll, scrollToIndex } =
        useTimelineScroll(containerRef);
    const { handleShare } = useStageShare();
    const [mobilePopupIndex, setMobilePopupIndex] = useState<number | null>(
        null
    );
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
    const [stageToDelete, setStageToDelete] = useState<number | null>(null);

    // Handle quick add button click
    const handleQuickAdd = (stageId: number) => {
        setSelectedStageId(stageId);
        setShowAnnouncementModal(true);
    };

    // Handle delete button click
    const handleDeleteClick = (stageId: number) => {
        setStageToDelete(stageId);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (stageToDelete === null) return;

        try {
            await deleteStage(stageToDelete);
            setStageToDelete(null);
            // Optionally refresh the page or update the stages list
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete stage:", error);
            alert("Aşama silinirken bir hata oluştu.");
        }
    };

    const activeStageIndex = STAGES.findIndex(
        (s) => s.id === TIMELINE_CONSTANTS.ACTIVE_STAGE_ID
    );

    // Context for Sidebar/Content sync
    const { setFocusedStageId } = useTimelineContext();

    // Sync focused stage ID to context
    useEffect(() => {
        if (STAGES[focusedIndex]) {
            setFocusedStageId(STAGES[focusedIndex].id);
        }
    }, [focusedIndex, setFocusedStageId]);

    // 2-1-2 Stepper Window Logic
    const { visibleStart, visibleEnd } = useStepperWindow(
        focusedIndex,
        STAGES.length
    );

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
            {/* Back to Panel Button */}
            <Link href="/admin" className="fixed top-24 left-4 z-[40] flex items-center gap-2 text-gray-500 hover:text-[#ed2630] bg-white/90 p-2 rounded-lg shadow-sm backdrop-blur border border-gray-100 transition-colors md:top-24 md:left-8">
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="hidden md:inline font-bold text-sm">Panel</span>
            </Link>

            {/* Timeline Container - Match user Timeline layout */}
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
                        paddingTop: `calc(${TIMELINE_CONSTANTS.CONTAINER_HEIGHT_VH / 2}dvh - ${TIMELINE_CONSTANTS.ITEM_HEIGHT_VH / 2}dvh)`,
                        paddingBottom: `calc(${TIMELINE_CONSTANTS.CONTAINER_HEIGHT_VH / 2}dvh - ${TIMELINE_CONSTANTS.ITEM_HEIGHT_VH / 2}dvh)`,
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {/* Add trigger at the beginning */}
                    <AddContentTrigger
                        position={0}
                        onClick={() => {
                            if (STAGES[0]) {
                                handleQuickAdd(STAGES[0].id, STAGES[0].title);
                            }
                        }}
                    />

                    {STAGES.map((stage, index) => {
                        const isFocused = focusedIndex === index;
                        const isCurrent =
                            stage.id === TIMELINE_CONSTANTS.ACTIVE_STAGE_ID;
                        const isPast =
                            stage.id < TIMELINE_CONSTANTS.ACTIVE_STAGE_ID;
                        const isFuture =
                            stage.id > TIMELINE_CONSTANTS.ACTIVE_STAGE_ID;

                        // 2-1-2 Window visibility calculation
                        const isVisible =
                            index >= visibleStart && index <= visibleEnd;
                        const distanceFromActive = index - focusedIndex;

                        return (
                            <div key={stage.id}>
                                <TimelineItem
                                    stage={stage}
                                    index={index}
                                    isFocused={isFocused}
                                    isCurrent={isCurrent}
                                    isPast={isPast}
                                    isFuture={isFuture}
                                    activeStageIndex={activeStageIndex}
                                    onShare={handleShare}
                                    onMobileClick={(clickedIndex) =>
                                        setMobilePopupIndex(clickedIndex)
                                    }
                                    onScrollTo={() => scrollToIndex(index)}
                                    isVisible={isVisible}
                                    distanceFromActive={distanceFromActive}
                                    isAdmin={true}
                                    onDelete={() => handleDeleteClick(stage.id)}
                                />

                                {/* Add trigger after each stage */}
                                <AddContentTrigger
                                    position={index + 1}
                                    onClick={() => handleQuickAdd(stage.id, stage.title)}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Simplified Announcement Modal */}
                {selectedStageId !== null && (
                    <SimplifiedAnnouncementModal
                        isOpen={showAnnouncementModal}
                        onClose={() => {
                            setShowAnnouncementModal(false);
                            setSelectedStageId(null);
                        }}
                        stageId={selectedStageId}
                    />
                )}

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

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {stageToDelete !== null && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setStageToDelete(null)}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-card relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border"
                            >
                                <div className="p-6 text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                                        <span className="material-symbols-outlined text-red-600 !text-3xl">
                                            warning
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2">
                                        Emin misiniz?
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        Bu aşamayı ve içindeki tüm duyuruları silmek üzeresiniz. Bu işlem geri alınamaz.
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        <button
                                            onClick={() => setStageToDelete(null)}
                                            className="px-5 py-2.5 rounded-xl border border-border font-medium hover:bg-secondary transition-colors"
                                        >
                                            Vazgeç
                                        </button>
                                        <button
                                            onClick={handleDeleteConfirm}
                                            className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                                        >
                                            Evet, Sil
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Stepper Controls - Outside timeline wrapper */}
            {/* Stepper Controls - Outside timeline wrapper */}
            {!showAnnouncementModal && (
                <StepperControls
                    currentStep={focusedIndex}
                    totalSteps={STAGES.length}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onJumpTo={handleJumpTo}
                />
            )}
        </>
    );
}
