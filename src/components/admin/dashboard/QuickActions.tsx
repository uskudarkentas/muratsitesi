import Link from "next/link";

export function QuickActions() {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#46474A]">
                Hızlı İşlemler
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Add Announcement */}
                {/* Add Announcement */}
                <a
                    href="/admin/timeline?action=add&type=announcement"
                    className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-transparent bg-white p-8 shadow-sm transition-all hover:border-[#ed2630] hover:shadow-md dark:bg-[#2a1516]"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-[#ed2630] transition-colors group-hover:bg-[#ed2630] group-hover:text-white dark:bg-red-900/20">
                        <span className="material-symbols-outlined text-4xl">
                            campaign
                        </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 group-hover:text-[#ed2630] dark:text-white dark:group-hover:text-[#ed2630]">
                        Duyuru Ekle
                    </span>
                </a>

                {/* Add Meeting */}
                <a
                    href="/admin/timeline?action=add&type=event"
                    className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-transparent bg-white p-8 shadow-sm transition-all hover:border-[#ed2630] hover:shadow-md dark:bg-[#2a1516]"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-[#ed2630] transition-colors group-hover:bg-[#ed2630] group-hover:text-white dark:bg-red-900/20">
                        <span className="material-symbols-outlined text-4xl">
                            calendar_add_on
                        </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 group-hover:text-[#ed2630] dark:text-white dark:group-hover:text-[#ed2630]">
                        Toplantı Ekle
                    </span>
                </a>

                {/* Add Survey */}
                <a
                    href="/admin/timeline?action=add&type=announcement"
                    className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-transparent bg-white p-8 shadow-sm transition-all hover:border-[#ed2630] hover:shadow-md dark:bg-[#2a1516]"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-[#ed2630] transition-colors group-hover:bg-[#ed2630] group-hover:text-white dark:bg-red-900/20">
                        <span className="material-symbols-outlined text-4xl">
                            poll
                        </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 group-hover:text-[#ed2630] dark:text-white dark:group-hover:text-[#ed2630]">
                        Anket Ekle
                    </span>
                </a>

                {/* Manage Process */}
                <a
                    href="/admin/timeline"
                    className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-transparent bg-white p-8 shadow-sm transition-all hover:border-[#ed2630] hover:shadow-md dark:bg-[#2a1516]"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-[#ed2630] transition-colors group-hover:bg-[#ed2630] group-hover:text-white dark:bg-red-900/20">
                        <span className="material-symbols-outlined text-4xl">
                            settings_applications
                        </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 group-hover:text-[#ed2630] dark:text-white dark:group-hover:text-[#ed2630]">
                        Süreci Yönet
                    </span>
                </a>
            </div>
        </div>
    );
}
