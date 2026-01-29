"use client";

import { motion } from "framer-motion";
import { TIMELINE_CONSTANTS } from "@/lib/constants";

interface StepperControlsProps {
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onPrevious: () => void;
    onJumpTo: (index: number) => void;
}

export function StepperControls({
    currentStep,
    totalSteps,
    onNext,
    onPrevious,
    onJumpTo
}: StepperControlsProps) {
    const canGoPrevious = currentStep > 0;
    const canGoNext = currentStep < totalSteps - 1;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Previous Button */}
            <motion.button
                onClick={onPrevious}
                disabled={!canGoPrevious}
                whileHover={{ scale: canGoPrevious ? 1.1 : 1 }}
                whileTap={{ scale: canGoPrevious ? 0.95 : 1 }}
                className={`p-2 rounded-full transition-colors ${canGoPrevious
                        ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        : "text-gray-300 dark:text-gray-700 cursor-not-allowed"
                    }`}
                aria-label="Previous step"
            >
                <span className="material-symbols-outlined">chevron_left</span>
            </motion.button>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2 min-w-[120px] justify-center">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {currentStep + 1}
                </span>
                <span className="text-xs text-gray-400">/</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {totalSteps}
                </span>
            </div>

            {/* Next Button */}
            <motion.button
                onClick={onNext}
                disabled={!canGoNext}
                whileHover={{ scale: canGoNext ? 1.1 : 1 }}
                whileTap={{ scale: canGoNext ? 0.95 : 1 }}
                className={`p-2 rounded-full transition-colors ${canGoNext
                        ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        : "text-gray-300 dark:text-gray-700 cursor-not-allowed"
                    }`}
                aria-label="Next step"
            >
                <span className="material-symbols-outlined">chevron_right</span>
            </motion.button>

            {/* Jump to Dropdown (Optional - hidden on mobile) */}
            <div className="hidden md:block ml-2 pl-2 border-l border-gray-300 dark:border-gray-600">
                <select
                    value={currentStep}
                    onChange={(e) => onJumpTo(Number(e.target.value))}
                    className="text-xs bg-transparent border-0 text-gray-600 dark:text-gray-400 cursor-pointer focus:outline-none"
                    aria-label="Jump to step"
                >
                    {Array.from({ length: totalSteps }, (_, i) => (
                        <option key={i} value={i}>
                            Aşama {i + 1}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
