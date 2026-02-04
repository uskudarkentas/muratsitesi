"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { StagesDropdown } from "@/components/StagesDropdown";

interface HeaderNavProps {
    stages: any[];
}

export function HeaderNav({ stages }: HeaderNavProps) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="hidden md:flex gap-8 text-lg font-medium items-center">
            {/* Aşamalar Dropdown - It handles its own active state internally now (after we update it) */}
            <StagesDropdown stages={stages} />

            <Link
                className={cn(
                    "transition-colors",
                    isActive("/proje-planlari")
                        ? "text-primary font-bold"
                        : "text-muted-foreground hover:text-primary"
                )}
                href="#"
            >
                Proje Planları
            </Link>
            <Link
                className={cn(
                    "transition-colors",
                    isActive("/iletisim")
                        ? "text-primary font-bold"
                        : "text-muted-foreground hover:text-primary"
                )}
                href="/iletisim"
            >
                İletişim
            </Link>
        </nav>
    );
}
