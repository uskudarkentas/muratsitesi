"use client";

import { useState } from "react";
import { BottomNav } from "@/components/admin/mobile/BottomNav";
import { SideDrawer } from "@/components/admin/mobile/SideDrawer";

export function MobileNavigation() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <BottomNav onMoreClick={() => setIsDrawerOpen(true)} />

            {/* Mobile Side Drawer */}
            <SideDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </>
    );
}
