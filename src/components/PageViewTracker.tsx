"use client";

import { useEffect } from "react";
import { trackAnalytics } from "@/actions/analytics";
import { usePathname } from "next/navigation";
import { ActionType } from "@prisma/client";

/**
 * Client component that tracks page views
 * Place this in any page to automatically track visits
 */
export function PageViewTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Track page view when component mounts or pathname changes
        const trackPageView = async () => {
            try {
                await trackAnalytics({
                    action: ActionType.PAGE_VIEW,
                    targetId: pathname,
                });
            } catch (error) {
                // Silently fail - analytics should not block page rendering
                console.warn('Failed to track page view:', error);
            }
        };

        trackPageView();
    }, [pathname]);

    return null; // This component doesn't render anything
}
