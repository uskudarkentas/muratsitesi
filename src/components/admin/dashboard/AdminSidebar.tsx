"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Megaphone,
    Users,
    FileText,
    GitMerge,
    Palette,
    Settings,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
    const pathname = usePathname();

    const menuGroups = [
        {
            label: "GENEL BAKIŞ",
            items: [
                { label: "Kontrol Paneli", href: "/admin", icon: LayoutDashboard },
            ]
        },
        {
            label: "ANALİZLER",
            items: [
                { label: "Duyuru Analizleri", href: "/admin/analytics/announcements", icon: Megaphone },
                { label: "Toplantı Analizleri", href: "/admin/analytics/meetings", icon: Users },
                { label: "Anket Analizleri", href: "/admin/analytics/surveys", icon: FileText },
            ]
        },
        {
            label: "YAPILANDIRMA",
            items: [
                { label: "Süreç Yönetimi", href: "/admin/timeline", icon: GitMerge },
                { label: "Sayfa Tasarımı", href: "/admin/page-builder", icon: Palette },
            ]
        }
    ];

    return (
        <aside className="hidden w-64 flex-col border-r border-gray-100 bg-white/50 backdrop-blur-xl md:flex h-screen sticky top-0 font-sans">
            {/* Logo Area */}
            <div className="flex h-20 shrink-0 items-center px-6">
                <div className="relative h-11 w-full max-w-[180px]">
                    <Image
                        src="/header-logo-final.png"
                        alt="Üsküdar Belediyesi"
                        fill
                        className="object-contain object-left"
                        priority
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-4 py-6">
                {menuGroups.map((group) => (
                    <div key={group.label} className="flex flex-col gap-2">
                        <h3 className="px-3 text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                            {group.label}
                        </h3>
                        {group.items.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-[#ed2630]/5 text-[#ed2630]"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <Icon
                                        size={18}
                                        strokeWidth={2}
                                        className={cn(
                                            isActive ? "text-[#ed2630]" : "text-gray-400 group-hover:text-gray-600"
                                        )}
                                    />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 mt-auto border-t border-gray-100 bg-white/50 backdrop-blur-sm">
                <div className="flex flex-col gap-1">
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        <Settings size={18} className="text-gray-400" />
                        Ayarlar
                    </Link>
                    <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors text-left">
                        <LogOut size={18} className="text-gray-400" />
                        Çıkış Yap
                    </button>
                </div>

                {/* User Info (Mini) */}
                <div className="mt-4 flex items-center gap-3 px-2 py-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#ed2630] to-[#f05058] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        AY
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="truncate text-xs font-semibold text-gray-900">
                            Ahmet Yılmaz
                        </span>
                        <span className="truncate text-[10px] text-gray-500">
                            Yönetici
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
