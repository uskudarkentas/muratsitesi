import Link from "next/link";
import Image from "next/image";
import { db } from "@/core/database/client";
import { HeaderNav } from "@/components/HeaderNav";

export default async function Header() {
    // Fetch stages dynamically from database
    let stages = [];
    try {
        stages = await db.stage.findMany({
            orderBy: { sequenceOrder: "asc" },
            select: {
                id: true,
                title: true,
                slug: true,
                iconKey: true,
            },
        });
    } catch (error) {
        console.warn("Failed to fetch stages in Header:", error);
        // Continue with empty stages during build error
    }

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
                <HeaderNav stages={stages} />
                <Link
                    href="/admin/login"
                    aria-label="Kullanıcı Girişi"
                    className="hidden md:flex items-center gap-2 h-10 px-5 rounded-full border border-border bg-transparent hover:bg-secondary hover:border-primary/50 text-foreground transition-all group"
                >
                    <span className="material-symbols-outlined !text-[20px] text-muted-foreground group-hover:text-primary transition-colors">person</span>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">Giriş Yap</span>
                </Link>
                {/* Mobile only icon */}
                <Link
                    href="/admin/login"
                    aria-label="Kullanıcı Girişi"
                    className="md:hidden flex size-10 items-center justify-center rounded-full border border-border bg-transparent text-muted-foreground hover:bg-secondary transition-colors"
                >
                    <span className="material-symbols-outlined !text-[22px]">person</span>
                </Link>
            </div>
        </header>
    );
}
