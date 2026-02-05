import Link from "next/link";
import Image from "next/image";

export function AdminSidebar() {
    return (
        <aside className="hidden w-64 flex-col border-r border-[#e7cfd0] bg-white dark:bg-[#2a1516] dark:border-[#3a1d1e] md:flex h-screen sticky top-0 overflow-y-auto">
            <div className="flex h-16 shrink-0 items-center border-b border-[#e7cfd0] px-6 dark:border-[#3a1d1e]">
                <div className="relative h-10 w-full max-w-[200px]">
                    <Image
                        src="/header-logo-final.png"
                        alt="Üsküdar Belediyesi - Kentaş - Üsküdar Yenileniyor"
                        fill
                        className="object-contain object-left"
                        priority
                    />
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6">
                {/* User Profile */}
                <div className="flex items-center gap-3 rounded-xl border border-[#e7cfd0] bg-[#fcf8f8] p-3 dark:border-[#3a1d1e] dark:bg-[#33181a]">
                    <div
                        className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center bg-gray-200"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAswF86v80urDSpYdpiSfblg0X3WHBZeu_HTQLXHVUr7tvdr3VuMlr-XHi5E2aNQvM-oSghMyZVSiqVM2qGIawtKigVXCW-OFUCXcdNiIOiV7yh-0qg7jOCDaJV2Is69MkNd2JrSk1RxdgtmFGJqzaqjw82Rh_b6zbqxhXT974685JcjBXQH7yJQJ7mvUW6TntOtjGkFXG2wTaAM8OGD2rXf7Rzw_9CVlyB_ESEP9A3mWm191N8IVh5FTzLyRqd5sBMHSeh1nuCu3s")',
                        }}
                    ></div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-sm font-bold text-gray-900 dark:text-white">
                            Ahmet Yılmaz
                        </span>
                        <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                            Site Yöneticisi
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 rounded-lg bg-[#ed2630]/10 px-3 py-3 text-[#ed2630] transition-colors dark:bg-[#ed2630]/20"
                    >
                        <span className="material-symbols-outlined filled">
                            dashboard
                        </span>
                        <span className="font-bold">Kontrol Paneli</span>
                    </Link>
                    <Link
                        href="/admin/timeline"
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#3a1d1e]"
                    >
                        <span className="material-symbols-outlined">
                            campaign
                        </span>
                        <span className="font-medium">Duyurular</span>
                    </Link>
                    <Link
                        href="/admin/timeline"
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#3a1d1e]"
                    >
                        <span className="material-symbols-outlined">
                            groups
                        </span>
                        <span className="font-medium">Toplantılar</span>
                    </Link>
                    <Link
                        href="/admin/timeline"
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#3a1d1e]"
                    >
                        <span className="material-symbols-outlined">poll</span>
                        <span className="font-medium">Anketler</span>
                    </Link>
                    <Link
                        href="/admin/timeline"
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#3a1d1e]"
                    >
                        <span className="material-symbols-outlined">
                            construction
                        </span>
                        <span className="font-medium">Süreç Yönetimi</span>
                    </Link>
                    <Link
                        href="/admin/page-builder"
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#3a1d1e]"
                    >
                        <span className="material-symbols-outlined">
                            web
                        </span>
                        <span className="font-medium">Sayfa Tasarımı</span>
                    </Link>
                    <div className="my-2 border-t border-[#e7cfd0] dark:border-[#3a1d1e]"></div>
                    <a
                        href="#"
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#3a1d1e]"
                    >
                        <span className="material-symbols-outlined">
                            settings
                        </span>
                        <span className="font-medium">Ayarlar</span>
                    </a>
                </nav>
            </div>

            <div className="p-4 mt-auto">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e7cfd0] bg-white px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#3a1d1e] dark:bg-[#33181a] dark:text-gray-200 dark:hover:bg-[#3a1d1e]">
                    <span className="material-symbols-outlined text-[18px]">
                        logout
                    </span>
                    Çıkış Yap
                </button>
            </div>
        </aside>
    );
}
