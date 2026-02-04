"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Stage {
    id: number;
    title: string;
    slug: string;
    iconKey: string;
}

interface StagesDropdownProps {
    stages: Stage[];
}

export function StagesDropdown({ stages }: StagesDropdownProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();
    const isActive = pathname?.startsWith("/asamalar");

    return (
        <div className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={cn(
                    "flex items-center gap-1 transition-opacity hover:opacity-80",
                    isActive || isDropdownOpen ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
                )}
            >
                Aşamalar
                <span className="material-symbols-outlined !text-xl">
                    {isDropdownOpen ? "expand_less" : "expand_more"}
                </span>
            </button>

            {isDropdownOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-20 py-2 max-h-96 overflow-y-auto">
                        <style jsx>{`
                            div {
                                scrollbar-width: none;
                                -ms-overflow-style: none;
                            }
                            div::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        {stages.map((stage) => (
                            <Link
                                key={stage.id}
                                href={`/asamalar/${stage.slug}`}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <span className="material-symbols-outlined text-primary !text-2xl">
                                    {stage.iconKey}
                                </span>
                                <span className="text-sm font-medium">
                                    {stage.title}
                                </span>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
