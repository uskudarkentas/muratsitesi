"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, TrendUp, Megaphone, DotsThree } from "@phosphor-icons/react";

interface BottomNavProps {
    onMoreClick: () => void;
}

export function BottomNav({ onMoreClick }: BottomNavProps) {
    const pathname = usePathname();

    const navItems = [
        {
            label: "Dashboard",
            icon: House,
            href: "/admin",
            isActive: pathname === "/admin",
        },
        {
            label: "Süreç",
            icon: TrendUp,
            href: "/admin/timeline",
            isActive: pathname === "/admin/timeline",
        },
        {
            label: "Duyurular",
            icon: Megaphone,
            href: "/admin/announcements",
            isActive: pathname === "/admin/announcements",
        },
    ];

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-slate-200/50 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
            style={{
                paddingBottom: "env(safe-area-inset-bottom)",
            }}
        >
            <div className="grid grid-cols-4 h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 transition-all ${item.isActive
                                    ? "text-[#ed2630]"
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <Icon
                                weight={item.isActive ? "fill" : "light"}
                                className="w-6 h-6"
                            />
                            <span className="text-xs font-semibold tracking-tight">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}

                {/* More Button */}
                <button
                    onClick={onMoreClick}
                    className="flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-slate-700 transition-all"
                >
                    <DotsThree weight="bold" className="w-6 h-6" />
                    <span className="text-xs font-semibold tracking-tight">Daha Fazla</span>
                </button>
            </div>
        </nav>
    );
}
