"use client";

import Link from "next/link";
import { useState } from "react";
import { STAGES } from "@/lib/stages";
import Image from "next/image";

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-border bg-card px-6 lg:px-12 py-2 shadow-sm z-30 relative sticky top-0 pt-[env(safe-area-inset-top)]">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/" className="relative h-12 w-[180px] md:h-12 md:w-[300px] max-w-full block">
                        <Image
                            src="/header-logo-final.png"
                            alt="Üsküdar Belediyesi - Kentaş - Üsküdar Yenileniyor"
                            fill
                            className="object-contain object-center"
                            priority
                        />
                    </Link>
                </div>
            </div>
            <div className="flex items-center gap-8">
                <nav className="hidden md:flex gap-8 text-lg font-medium">
                    {/* Aşamalar Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="text-primary font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
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
                                    {STAGES.map((stage) => (
                                        <Link
                                            key={stage.id}
                                            href={`/asamalar/${stage.slug}`}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <span className="material-symbols-outlined text-primary !text-2xl">
                                                {stage.icon}
                                            </span>
                                            <span className="text-sm font-medium">{stage.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <Link
                        className="text-muted-foreground hover:text-primary transition-colors"
                        href="#"
                    >
                        Proje Planları
                    </Link>
                    <Link
                        className="text-muted-foreground hover:text-primary transition-colors"
                        href="#"
                    >
                        İletişim
                    </Link>
                </nav>
                <button
                    aria-label="Kullanıcı Girişi"
                    className="hidden md:flex items-center gap-2 h-10 px-5 rounded-full border border-border bg-transparent hover:bg-secondary hover:border-primary/50 text-foreground transition-all group"
                >
                    <span className="material-symbols-outlined !text-[20px] text-muted-foreground group-hover:text-primary transition-colors">person</span>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">Giriş Yap</span>
                </button>
                {/* Mobile only icon */}
                <button
                    aria-label="Kullanıcı Girişi"
                    className="md:hidden flex size-10 items-center justify-center rounded-full border border-border bg-transparent text-muted-foreground hover:bg-secondary transition-colors"
                >
                    <span className="material-symbols-outlined !text-[22px]">person</span>
                </button>
            </div>
        </header>
    );
}
