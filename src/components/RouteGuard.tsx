"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function RouteGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        return null;
    }

    return <>{children}</>;
}
