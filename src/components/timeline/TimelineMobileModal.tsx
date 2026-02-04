import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StageCard } from "./StageCard";
import { STAGES } from "@/lib/stages";
import { TIMELINE_CONSTANTS } from "@/lib/constants";

interface TimelineMobileModalProps {
    stage: any;
    onClose: () => void;
    activeStageIndex: number;
    onShare: (stage: any) => void;
}

export function TimelineMobileModal({
    stage,
    onClose,
    activeStageIndex,
    onShare
}: TimelineMobileModalProps) {
    if (!stage) return null;

    const isCurrent = stage.status === 'ACTIVE';
    const isPast = stage.status === 'COMPLETED';
    const isFuture = stage.status === 'LOCKED';

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/50 z-40"
                onClick={onClose}
            />

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="md:hidden fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50"
            >
                <div className="relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    <StageCard
                        stage={stage}
                        isCurrent={isCurrent}
                        isPast={isPast}
                        isFuture={isFuture}
                        activeStageIndex={activeStageIndex}
                        onShare={onShare}
                        variant="mobile"
                    />
                </div>
            </motion.div>
        </>
    );
}
