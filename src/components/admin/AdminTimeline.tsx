"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTimelineContext } from "@/context/TimelineContext";
import { deleteStage, deletePost } from "@/actions/admin";
import { completeStage } from "@/actions/stage";


import { TIMELINE_CONSTANTS } from "@/lib/constants";
import { STAGES as PREDEFINED_STAGES } from "@/lib/stages";
import { useTimelineScroll } from "@/hooks/useTimelineScroll";
import { useStepperWindow } from "@/hooks/useStepperWindow";
import { useStageShare } from "@/hooks/useStageShare";
import { TimelineItem } from "@/components/timeline/TimelineItem";
import { TimelineMobileModal } from "@/components/timeline/TimelineMobileModal";
import { MeetingDetailsModal } from "@/components/timeline/MeetingDetailsModal";
import { StepperControls } from "@/components/timeline/StepperControls";
import { AddContentTrigger } from "@/components/admin/AddContentTrigger";
import { SimplifiedAnnouncementModal } from "@/components/admin/SimplifiedAnnouncementModal";
import { StageManagerModal } from "@/components/admin/stage-manager/StageManagerModal";
import { BuilderSidebar } from "@/components/admin/builder/BuilderSidebar";

import { useAdminModals } from "@/hooks/useAdminModals";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

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

    const STAGES = stages;

    // Find the stage marked as ACTIVE in the database
    const dbActiveIndex = STAGES.findIndex(s => s.status === 'ACTIVE');
    const activeStageIndex = dbActiveIndex !== -1 ? dbActiveIndex : 0;
    const currentActiveStage = STAGES[activeStageIndex] || STAGES[0];

    const containerRef = useRef<HTMLDivElement>(null);
    const { focusedIndex, handleScroll, scrollToIndex } =
        useTimelineScroll(containerRef, activeStageIndex, 64);
    const { handleShare } = useStageShare();
    const [mobilePopupIndex, setMobilePopupIndex] = useState<number | null>(null);
    const [selectedMeeting, setSelectedMeeting] = useState<any | null>(null);

    // SOLID Refactor: Use custom hook for modal management
    const {
        stageToDelete, setStageToDelete,
        stageToComplete, setStageToComplete,
        postToDelete, setPostToDelete,
        showAnnouncementModal,
        selectedStageId,
        postToEdit,
        initialPostType,
        initialContentType,
        handleQuickAddPost,
        handleEditPost,
        handleDeleteStageConfirm,
        handleCompleteStageConfirm,
        handleDeletePostConfirm,
        closeAnnouncementModal
    } = useAdminModals();

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
        if (focusedIndex < STAGES.length - 1) scrollToIndex(focusedIndex + 1);
    };

    const handlePrevious = () => {
        if (focusedIndex > 0) scrollToIndex(focusedIndex - 1);
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
    const handleEditStageAction = (stage: any) => {
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
            {/* Header Controls */}
            <div className="fixed top-24 left-4 md:left-8 z-[40] flex flex-col gap-2 pointer-events-none lg:pointer-events-auto">
                <div className="pointer-events-auto lg:hidden">
                    <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-[#ed2630] bg-white/90 p-2 rounded-lg shadow-sm backdrop-blur border border-gray-100 transition-colors w-fit">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="hidden md:inline font-bold text-sm">Panel</span>
                    </Link>
                </div>

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

            {isStructureMode && (
                <div className="fixed top-28 right-8 z-[40] hidden lg:block">
                    <button
                        onClick={() => setIsStructureMode(false)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg backdrop-blur border transition-colors w-fit bg-[#98EB94] text-slate-800 border-[#98EB94] hover:bg-[#7dd979]"
                    >
                        <span className="material-symbols-outlined">check</span>
                        <span className="font-bold text-sm">Düzenlemeyi Bitir</span>
                    </button>
                </div>
            )}

            <BuilderSidebar
                onAddStage={() => setIsStructureMode(true)}
                onAddPost={(type) => {
                    if (STAGES[activeStageIndex]) handleQuickAddPost(STAGES[activeStageIndex].id, type);
                }}
            />

            <div className="relative w-full h-full min-h-[80vh] overflow-hidden">
                <div className="relative w-full h-full flex justify-center items-start">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-700 z-0"></div>

                    <div
                        ref={containerRef}
                        onScroll={handleScroll}
                        className="relative z-10 w-full overflow-y-auto no-scrollbar snap-y snap-mandatory"
                        style={{
                            height: `${TIMELINE_CONSTANTS.CONTAINER_HEIGHT_VH}dvh`,
                            paddingTop: `calc(${TIMELINE_CONSTANTS.CONTAINER_HEIGHT_VH / 2}dvh - ${TIMELINE_CONSTANTS.ITEM_HEIGHT_VH / 2}dvh)`,
                            paddingBottom: `calc(${TIMELINE_CONSTANTS.CONTAINER_HEIGHT_VH / 2}dvh - ${TIMELINE_CONSTANTS.ITEM_HEIGHT_VH / 2}dvh)`,
                        }}
                    >
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

                        {!isStructureMode && (
                            <AddContentTrigger
                                position={0}
                                onClick={() => STAGES[0] && handleQuickAddPost(STAGES[0].id)}
                            />
                        )}

                        {STAGES.map((stage, index) => {
                            const isFocused = focusedIndex === index;
                            const isCurrent = index === activeStageIndex;
                            const isPast = stage.status === 'COMPLETED';
                            const isFuture = stage.status === 'LOCKED';
                            const isVisible = index >= visibleStart && index <= visibleEnd;
                            const distanceFromActive = index - focusedIndex;
                            const isFixed = PREDEFINED_STAGES.some(p => p.id === stage.id);

                            return (
                                <div key={stage.id} className="relative">
                                    {isStructureMode && isVisible && !isFixed && (
                                        <div className="absolute top-1/2 left-1/2 ml-16 -translate-y-1/2 z-50 flex flex-col gap-2">
                                            <button
                                                onClick={() => handleEditStageAction(stage)}
                                                className="bg-white text-slate-700 hover:text-[#ed2630] p-3 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-110"
                                                title="Düzenle"
                                            >
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                        </div>
                                    )}

                                    <TimelineItem
                                        stage={stage}
                                        index={index}
                                        isFocused={isFocused}
                                        isCurrent={isCurrent}
                                        isPast={isPast}
                                        isFuture={isFuture}
                                        activeStageIndex={activeStageIndex}
                                        onShare={handleShare}
                                        onMobileClick={(idx) => setMobilePopupIndex(idx)}
                                        onScrollTo={() => scrollToIndex(index)}
                                        isVisible={isVisible}
                                        distanceFromActive={distanceFromActive}
                                        isAdmin={true}
                                        onDelete={stage.id > 12 ? () => setStageToDelete(stage.id) : undefined}
                                        onComplete={stage.id === currentActiveStage.id ? (id) => setStageToComplete(id) : undefined}
                                        onEditPost={(post) => handleEditPost(stage.id, post)}
                                        onDeletePost={(postId) => setPostToDelete(postId)}
                                        onMeetingClick={(meeting) => setSelectedMeeting(meeting)}
                                    />

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

                    {/* Modals & Dialogs */}
                    {(selectedStageId !== null || postToEdit !== null) && (
                        <SimplifiedAnnouncementModal
                            isOpen={showAnnouncementModal}
                            onClose={closeAnnouncementModal}
                            stageId={selectedStageId || postToEdit?.stageId}
                            initialType={initialContentType}
                            initialPostType={initialPostType}
                            editPost={postToEdit}
                        />
                    )}

                    <StageManagerModal
                        isOpen={managerModalProps.isOpen}
                        onClose={() => setManagerModalProps(curr => ({ ...curr, isOpen: false }))}
                        insertAfterOrder={managerModalProps.insertAfterOrder}
                        nextOrder={managerModalProps.nextOrder}
                        editStage={managerModalProps.editStage}
                        activeStageOrder={currentActiveStage.sequenceOrder}
                        usedIcons={STAGES.map(s => s.iconKey)}
                    />

                    <AnimatePresence>
                        {mobilePopupIndex !== null && (
                            <TimelineMobileModal
                                stage={STAGES[mobilePopupIndex]}
                                onClose={() => setMobilePopupIndex(null)}
                                activeStageIndex={activeStageIndex}
                                onShare={handleShare}
                            />
                        )}
                        {selectedMeeting !== null && (
                            <MeetingDetailsModal
                                meeting={selectedMeeting}
                                onClose={() => setSelectedMeeting(null)}
                            />
                        )}
                    </AnimatePresence>

                    {/* SOLID Refactor: Reusable Confirm Dialogs */}
                    <ConfirmDialog
                        isOpen={stageToDelete !== null}
                        onClose={() => setStageToDelete(null)}
                        onConfirm={handleDeleteStageConfirm}
                        title="Aşamayı Sil?"
                        description="Bu aşamayı ve içindeki tüm duyuruları silmek üzeresiniz. Bu işlem geri alınamaz."
                        confirmLabel="Evet, Sil"
                    />

                    <ConfirmDialog
                        isOpen={postToDelete !== null}
                        onClose={() => setPostToDelete(null)}
                        onConfirm={handleDeletePostConfirm}
                        title="İçeriği Sil?"
                        description="Bu içeriği (duyuru/toplantı) silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                        confirmLabel="Evet, Sil"
                        icon="delete_forever"
                    />

                    <ConfirmDialog
                        isOpen={stageToComplete !== null}
                        onClose={() => setStageToComplete(null)}
                        onConfirm={handleCompleteStageConfirm}
                        title="Aşamayı Tamamla"
                        description="Bu aşama 'TAMAMLANDI' olarak işaretlenecek ve bir sonraki aşama aktif hale getirilecektir. Devam etmek istiyor musunuz?"
                        confirmLabel="Evet, Tamamla"
                        variant="success"
                        icon="task_alt"
                    />
                </div>

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
