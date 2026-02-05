"use client";

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/admin/mobile/BottomNav";
import { SideDrawer } from "@/components/admin/mobile/SideDrawer";

export function MobileNavigation() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    if (!isMobile) return null;

    return (
        <div className="md:hidden">
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
