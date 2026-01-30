import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export function DashboardHeader() {
    return (
        <header className="sticky top-0 z-20 flex h-14 md:h-16 w-full items-center justify-between border-b border-[#e7cfd0] bg-white/80 px-4 md:px-8 backdrop-blur-md dark:border-[#3a1d1e] dark:bg-[#221011]/80">
            {/* Logo - Mobile only (sidebar has logo on desktop) */}
            <div className="relative h-8 w-32 md:hidden">
                <Image
                    src="/header-logo-final.png"
                    alt="Murat Sitesi"
                    fill
                    className="object-contain object-left"
                    priority
                />
            </div>

            {/* Last Update - Desktop only */}
            <div className="hidden lg:block">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Son Güncelleme: Bugün, 09:41
                </span>
            </div>

            {/* View Site Button - Icon only on mobile, full on desktop */}
            <Link
                href="/"
                target="_blank"
                className="flex items-center justify-center gap-2 rounded-lg bg-[#ed2630] hover:bg-red-700 transition-colors shadow-sm w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2"
                title="Siteyi Görüntüle"
            >
                <span className="hidden md:inline text-sm font-bold text-white">
                    Siteyi Görüntüle
                </span>
                <ExternalLink className="w-5 h-5 text-white md:w-4 md:h-4" />
            </Link>
        </header>
    );
}
