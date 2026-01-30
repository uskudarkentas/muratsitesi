
export function RecentActivity() {
    return (
        <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#46474A]">
                    Son Aktiviteler
                </h2>
                <a
                    className="text-sm font-semibold text-[#ed2630] hover:underline"
                    href="#"
                >
                    Tümünü Gör
                </a>
            </div>
            <div className="rounded-xl border border-[#e7cfd0] bg-white shadow-sm dark:border-[#3a1d1e] dark:bg-[#2a1516]">
                <div className="divide-y divide-[#e7cfd0] dark:divide-[#3a1d1e]">
                    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-[#33181a]">
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <span className="material-symbols-outlined text-xl">
                                check_circle
                            </span>
                        </div>
                        <div className="flex flex-1 flex-col">
                            <p className="font-bold text-gray-900 dark:text-white">
                                Proje Onayı Gerçekleşti
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Kentsel dönüşüm projesi belediye tarafından
                                onaylandı.
                            </p>
                            <span className="mt-1 text-xs font-medium text-gray-400">
                                2 saat önce
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-[#33181a]">
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            <span className="material-symbols-outlined text-xl">
                                campaign
                            </span>
                        </div>
                        <div className="flex flex-1 flex-col">
                            <p className="font-bold text-gray-900 dark:text-white">
                                Yeni Duyuru Yayınlandı
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                "Mart Ayı Aidat Ödemeleri Hakkında" başlıklı
                                duyuru tüm sakinlere gönderildi.
                            </p>
                            <span className="mt-1 text-xs font-medium text-gray-400">
                                Dün, 14:30
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-[#33181a]">
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                            <span className="material-symbols-outlined text-xl">
                                poll
                            </span>
                        </div>
                        <div className="flex flex-1 flex-col">
                            <p className="font-bold text-gray-900 dark:text-white">
                                Anket Tamamlandı
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                "Dış Cephe Rengi Seçimi" anketi sonuçlandı.
                            </p>
                            <span className="mt-1 text-xs font-medium text-gray-400">
                                2 gün önce
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
