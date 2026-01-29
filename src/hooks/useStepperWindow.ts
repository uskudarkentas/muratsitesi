import { useState, useEffect } from "react";

interface StepperWindow {
    visibleStart: number;
    visibleEnd: number;
    beforeCount: number;
    afterCount: number;
    totalVisible: number;
}

export function useStepperWindow(activeIndex: number, totalSteps: number): StepperWindow {
    const [windowConfig, setWindowConfig] = useState<StepperWindow>({
        visibleStart: 0,
        visibleEnd: 4,
        beforeCount: 2,
        afterCount: 2,
        totalVisible: 5
    });

    useEffect(() => {
        const calculateWindow = () => {
            let beforeCount = 2;
            let afterCount = 2;

            // Responsive: increase visible items on larger screens
            if (window.innerWidth >= 1024) {
                beforeCount = 4;
                afterCount = 4;
            } else if (window.innerWidth >= 640) {
                beforeCount = 3;
                afterCount = 3;
            }

            const totalVisible = beforeCount + 1 + afterCount; // before + active + after

            // Calculate visible range, handling edge cases
            let visibleStart = Math.max(0, activeIndex - beforeCount);
            let visibleEnd = Math.min(totalSteps - 1, activeIndex + afterCount);

            // Adjust if we're at the start (can't show enough items before)
            if (activeIndex < beforeCount) {
                visibleEnd = Math.min(totalSteps - 1, visibleEnd + (beforeCount - activeIndex));
            }

            // Adjust if we're at the end (can't show enough items after)
            if (activeIndex > totalSteps - 1 - afterCount) {
                visibleStart = Math.max(0, visibleStart - (afterCount - (totalSteps - 1 - activeIndex)));
            }

            setWindowConfig({
                visibleStart,
                visibleEnd,
                beforeCount,
                afterCount,
                totalVisible
            });
        };

        calculateWindow();

        // Recalculate on window resize
        window.addEventListener('resize', calculateWindow);
        return () => window.removeEventListener('resize', calculateWindow);
    }, [activeIndex, totalSteps]);

    return windowConfig;
}
