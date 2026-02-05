"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTimelineContext } from "@/context/TimelineContext";
import { deleteStage } from "@/actions/admin";


import { TIMELINE_CONSTANTS } from "@/lib/constants";
import { STAGES as PREDEFINED_STAGES } from "@/lib/stages";
import { useTimelineScroll } from "@/hooks/useTimelineScroll";
import { useStepperWindow } from "@/hooks/useStepperWindow";
import { useStageShare } from "@/hooks/useStageShare";
import { TimelineItem } from "@/components/timeline/TimelineItem";
import { TimelineMobileModal } from "@/components/timeline/TimelineMobileModal";
import { StepperControls } from "@/components/timeline/StepperControls";
import { AddContentTrigger } from "@/components/admin/AddContentTrigger";
import { SimplifiedAnnouncementModal } from "@/components/admin/SimplifiedAnnouncementModal";
import { StageManagerModal } from "@/components/admin/stage-manager/StageManagerModal";
import { BuilderSidebar } from "@/components/admin/builder/BuilderSidebar";

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
    posts?: any[];
}

interface AdminTimelineProps {
    stages: StageData[];
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

    // Find the stage marked as ACTIVE in the database
    const dbActiveIndex = STAGES.findIndex(s => s.status === 'ACTIVE');

    // Use the ACTIVE status if found, otherwise fallback to first stage 
    // (In production, the database should almost always have one active stage)
    const activeStageIndex = dbActiveIndex !== -1
        ? dbActiveIndex
        : 0;

    const currentActiveStage = STAGES[activeStageIndex] || STAGES[0];

    const containerRef = useRef<HTMLDivElement>(null);
    const { focusedIndex, handleScroll, scrollToIndex } =
        useTimelineScroll(containerRef, activeStageIndex, 64);
    const { handleShare } = useStageShare();
    const [mobilePopupIndex, setMobilePopupIndex] = useState<number | null>(
        null
    );
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
    const [stageToDelete, setStageToDelete] = useState<number | null>(null);

    const [initialContentType, setInitialContentType] = useState<'heading' | 'text' | 'image' | null>(null);
    const [initialPostType, setInitialPostType] = useState<'ANNOUNCEMENT' | 'MEETING' | 'SURVEY' | null>(null);


    // Handle quick add button click for post types (ANNOUNCEMENT, MEETING, SURVEY)
    const handleQuickAddPost = (stageId: number, postType: 'ANNOUNCEMENT' | 'MEETING' | 'SURVEY' | null = null) => {
        setSelectedStageId(stageId);
        setInitialPostType(postType);
        setInitialContentType(null); // Ensure content type is reset
        setShowAnnouncementModal(true);
    };

    // Handle delete button click
    const handleDeleteClick = (stageId: number) => {
        setStageToDelete(stageId);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (stageToDelete === null) return;

        // Prevent deletion of default stages (Server-side check should also exist, but this is immediate UI feedback)
        if (stageToDelete <= 12) {
            alert('Varsayılan aşamalar silinemez.');
            setStageToDelete(null);
            return;
        }

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

    // Context for Sidebar/Content sync
    const { setFocusedStageId } = useTimelineContext();

    // Sync focused stage ID to context
    useEffect(() => {
        if (STAGES[focusedIndex]) {
            setFocusedStageId(STAGES[focusedIndex].id);
        }
    }, [focusedIndex, STAGES, setFocusedStageId]);

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

    const [isStructureMode, setIsStructureMode] = useState(false);
    const [managerModalProps, setManagerModalProps] = useState<{
        isOpen: boolean;
        insertAfterOrder?: number;
        nextOrder?: number;
        editStage?: any;
    }>({ isOpen: false });

    // Handle Edit Stage
    const handleEditStage = (stage: any) => {
        setManagerModalProps({
            isOpen: true,
            editStage: stage
        });
    };

    // Handle Insert Stage
    const handleInsertStage = (prevOrder: number, nextOrder?: number) => {
        setManagerModalProps({
            isOpen: true,
            insertAfterOrder: prevOrder,
            nextOrder: nextOrder
        });
    };

    return (
        <>
            {/* Header Controls - Mobile Only / Adapted for Desktop */}
            <div className="fixed top-24 left-4 md:left-8 z-[40] flex flex-col gap-2 pointer-events-none lg:pointer-events-auto">

                {/* Panel Back Button - Mobile Only */}
                <div className="pointer-events-auto lg:hidden">
                    <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-[#ed2630] bg-white/90 p-2 rounded-lg shadow-sm backdrop-blur border border-gray-100 transition-colors w-fit">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="hidden md:inline font-bold text-sm">Panel</span>
                    </Link>
                </div>

                {/* Mobile Toggle for Structure Mode */}
                <div className="pointer-events-auto lg:hidden">
                    <button
                        onClick={() => setIsStructureMode(!isStructureMode)}
                        className={`flex items-center gap-2 p-2 rounded-lg shadow-sm backdrop-blur border transition-colors w-fit ${isStructureMode
                            ? "bg-[#ed2630] text-white border-[#ed2630]"
                            : "bg-white/90 text-gray-500 hover:text-[#ed2630] border-gray-100"
                            }`}
                    >
                        <span className="material-symbols-outlined">{isStructureMode ? "check" : "edit_road"}</span>
                        <span className="hidden md:inline font-bold text-sm">{isStructureMode ? "Düzenlemeyi Bitir" : "Yapıyı Düzenle"}</span>
                    </button>
                </div>
            </div>

            {/* Desktop "Finish Editing" Button - Positioned relative to Sidebar */}
            {isStructureMode && (
                <div className="fixed top-28 lg:left-[calc(20rem+2rem)] z-[40] hidden lg:block">
                    <button
                        onClick={() => setIsStructureMode(false)}
                        className={`flex items-center gap-2 p-2 rounded-lg shadow-sm backdrop-blur border transition-colors w-fit bg-[#ed2630] text-white border-[#ed2630]`}
                    >
                        <span className="material-symbols-outlined">check</span>
                        <span className="font-bold text-sm">Düzenlemeyi Bitir</span>
                    </button>
                </div>
            )}

            {/* Builder Sidebar */}
            <BuilderSidebar
                onAddStage={() => setIsStructureMode(true)}
                onAddPost={(type) => {
                    if (STAGES[activeStageIndex]) handleQuickAddPost(STAGES[activeStageIndex].id, type);
                }}
            />

            {/* Main Content Layout */}
            <div className="relative w-full h-full min-h-[80vh] overflow-hidden">
                {/* Timeline Container */}
                <div className="relative w-full h-full flex justify-center items-start">
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

                        {/* Insert First Button (Only in Structure Mode) */}
                        {isStructureMode && (
                            <div className="w-full h-[10dvh] flex items-center justify-center relative snap-center">
                                <button
                                    onClick={() => handleInsertStage(0, STAGES[0]?.sequenceOrder)}
                                    className="bg-gray-200 text-white rounded-full w-7 h-7 flex items-center justify-center transition-all hover:scale-110 hover:bg-[#ed2630] shadow-sm z-20"
                                    title="Başa Ekle"
                                >
                                    <span className="material-symbols-outlined !text-lg font-bold">add</span>
                                </button>
                            </div>
                        )}

                        {/* Add trigger at the beginning - Disable in structure mode */}
                        {!isStructureMode && (
                            <AddContentTrigger
                                position={0}
                                onClick={() => {
                                    if (STAGES[0]) {
                                        // handleQuickAdd(STAGES[0].id); // Removed quick add, rely on sidebar
                                        handleQuickAddPost(STAGES[0].id)
                                    }
                                }}
                            />
                        )}

                        {STAGES.map((stage, index) => {
                            const isFocused = focusedIndex === index;
                            const isCurrent = index === activeStageIndex;
                            const isPast = stage.status === 'COMPLETED';
                            const isFuture = stage.status === 'LOCKED';

                            // 2-1-2 Window visibility calculation
                            const isVisible =
                                index >= visibleStart && index <= visibleEnd;
                            const distanceFromActive = index - focusedIndex;

                            // Check if stage is fixed (predefined)
                            const isFixed = PREDEFINED_STAGES.some(p => p.id === stage.id);

                            return (
                                <div key={stage.id} className="relative">
                                    {/* Edit Overlay in Structure Mode - Hidden for Fixed Stages */}
                                    {isStructureMode && isVisible && !isFixed && (
                                        <div className="absolute top-1/2 left-1/2 ml-16 -translate-y-1/2 z-50 flex flex-col gap-2">
                                            <button
                                                onClick={() => handleEditStage(stage)}
                                                className="bg-white text-slate-700 hover:text-[#ed2630] p-3 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-110"
                                                title="Düzenle"
                                            >
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                        </div>
                                    )}

                                    <div className="transition-all">
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
                                            onDelete={stage.id > 12 ? () => handleDeleteClick(stage.id) : undefined}
                                        />
                                    </div>

                                    {/* Insert Between Button */}
                                    {isStructureMode && (
                                        <div className="absolute bottom-[-5dvh] left-1/2 -translate-x-1/2 z-30 translate-y-1/2">
                                            <button
                                                onClick={() => handleInsertStage(stage.sequenceOrder, STAGES[index + 1]?.sequenceOrder)}
                                                className="bg-gray-200 text-white rounded-full w-6 h-6 flex items-center justify-center transition-all hover:scale-110 hover:bg-[#ed2630] shadow-sm"
                                                title="Araya Ekle"
                                            >
                                                <span className="material-symbols-outlined !text-[16px] font-bold">add</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Add trigger after each stage (Disable in Structure Mode) */}
                                    {!isStructureMode && (
                                        <AddContentTrigger
                                            position={index + 1}
                                            onClick={() => handleQuickAddPost(stage.id)}
                                        />
                                    )}
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
                                setInitialContentType(null);
                                setInitialPostType(null);
                            }}
                            stageId={selectedStageId}
                            initialType={initialContentType}
                            initialPostType={initialPostType}
                        />
                    )}

                    {/* Stage Manager Modal */}
                    <StageManagerModal
                        isOpen={managerModalProps.isOpen}
                        onClose={() => setManagerModalProps(curr => ({ ...curr, isOpen: false }))}
                        insertAfterOrder={managerModalProps.insertAfterOrder}
                        nextOrder={managerModalProps.nextOrder}
                        editStage={managerModalProps.editStage}
                        activeStageOrder={currentActiveStage.sequenceOrder}
                        usedIcons={STAGES.map(s => s.iconKey)}
                    />

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

                    {/* Delete Confirmation Modal */}
                    <AnimatePresence>
                        {stageToDelete !== null && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm md:hidden md:pointer-events-none transition-all"
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
                {!showAnnouncementModal && (
                    <StepperControls
                        currentStep={focusedIndex}
                        totalSteps={STAGES.length}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        onJumpTo={handleJumpTo}
                        className="!left-1/2 lg:!left-[calc(50%+10rem)]"
                    />
                )}
            </div>
        </>
    );
}
