import { getAnalyticsSummary } from "@/actions/analytics";

export async function DashboardStats() {
    const stats = await getAnalyticsSummary();

    return (
        <div className="flex flex-col gap-4">
            {/* Conversion Status - Full Width, Pinned at Top (Mobile Priority) */}
            <div className="flex flex-col justify-between rounded-xl border border-[#e7cfd0] bg-white p-6 shadow-sm dark:border-[#3a1d1e] dark:bg-[#2a1516]">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Dönüşüm Durumu
                    </p>
                    <span className="material-symbols-outlined text-[#ed2630]">
                        engineering
                    </span>
                </div>
                <div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                            45%
                        </span>
                        <span className="mb-1 text-sm font-medium text-green-600 dark:text-green-400">
                            +2% bu hafta
                        </span>
                    </div>
                    {/* Thick Progress Bar - Mobile Optimized (h-4 instead of h-2) */}
                    <div className="mt-4 h-4 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                        <div
                            className="h-4 rounded-full bg-[#ed2630] transition-all duration-500"
                            style={{ width: "45%" }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Secondary Stats - 2 Column Grid on Mobile, 4 Columns on Desktop */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {/* Total Malik */}
                <div className="flex flex-col justify-between rounded-xl border border-[#e7cfd0] bg-white p-4 md:p-6 shadow-sm dark:border-[#3a1d1e] dark:bg-[#2a1516]">
                    <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400">
                            Toplam Malik
                        </p>
                        <span className="material-symbols-outlined text-[#ed2630] text-xl md:text-2xl">
                            group
                        </span>
                    </div>
                    <div className="mt-3 md:mt-4">
                        <span className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            {stats.malikCount}
                        </span>
                        <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            Kayıtlı malik
                        </p>
                    </div>
                </div>

                {/* Page Views */}
                <div className="flex flex-col justify-between rounded-xl border border-[#e7cfd0] bg-white p-4 md:p-6 shadow-sm dark:border-[#3a1d1e] dark:bg-[#2a1516]">
                    <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400">
                            Sayfa Görüntüleme
                        </p>
                        <span className="material-symbols-outlined text-[#ed2630] text-xl md:text-2xl">
                            visibility
                        </span>
                    </div>
                    <div className="mt-3 md:mt-4">
                        <span className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            {stats.pageViews}
                        </span>
                        <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            Toplam ziyaret
                        </p>
                    </div>
                </div>

                {/* Survey Participation */}
                <div className="flex flex-col justify-between rounded-xl border border-[#e7cfd0] bg-white p-4 md:p-6 shadow-sm dark:border-[#3a1d1e] dark:bg-[#2a1516]">
                    <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400">
                            Anket Katılımı
                        </p>
                        <span className="material-symbols-outlined text-[#ed2630] text-xl md:text-2xl">
                            poll
                        </span>
                    </div>
                    <div className="mt-3 md:mt-4">
                        <span className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            {stats.surveyVotes}
                        </span>
                        <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            Toplam oy
                        </p>
                    </div>
                </div>

                {/* Shares */}
                <div className="flex flex-col justify-between rounded-xl border border-[#e7cfd0] bg-white p-4 md:p-6 shadow-sm dark:border-[#3a1d1e] dark:bg-[#2a1516]">
                    <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400">
                            Paylaşımlar
                        </p>
                        <span className="material-symbols-outlined text-[#ed2630] text-xl md:text-2xl">
                            share
                        </span>
                    </div>
                    <div className="mt-3 md:mt-4">
                        <span className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            {stats.shares}
                        </span>
                        <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            Toplam paylaşım
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
