"use client";

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/admin/mobile/BottomNav";
import { SideDrawer } from "@/components/admin/mobile/SideDrawer";

export function MobileNavigation() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);

        // Fail-safe: Always remove scroll lock classes when navigating admin or mounting this
        // This addresses issues where modals might have left the body locked
        const unlock = () => {
            document.body.classList.remove("antigravity-scroll-lock");
            document.body.classList.remove("overflow-hidden");
            document.body.style.overflow = "";
        };

        unlock();

        return () => {
            window.removeEventListener('resize', check);
            unlock();
        };
    }, []);

    if (!mounted || !isMobile) return null;

    return (
        <div className="lg:hidden">
            {/* Mobile Bottom Navigation */}
            <BottomNav onMoreClick={() => setIsDrawerOpen(true)} />

            {/* Mobile Side Drawer */}
            <SideDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
}
