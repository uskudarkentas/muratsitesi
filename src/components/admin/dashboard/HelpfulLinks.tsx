
export function HelpfulLinks() {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Faydalı Bağlantılar
            </h2>
            <div className="flex flex-col gap-3">
                <a
                    className="flex items-center gap-3 rounded-xl border border-[#e7cfd0] bg-white p-4 transition-all hover:bg-gray-50 hover:shadow-sm dark:border-[#3a1d1e] dark:bg-[#2a1516] dark:hover:bg-[#33181a]"
                    href="#"
                >
                    <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                        description
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        Yönetmelik Dokümanı
                    </span>
                </a>
                <a
                    className="flex items-center gap-3 rounded-xl border border-[#e7cfd0] bg-white p-4 transition-all hover:bg-gray-50 hover:shadow-sm dark:border-[#3a1d1e] dark:bg-[#2a1516] dark:hover:bg-[#33181a]"
                    href="#"
                >
                    <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                        contact_phone
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        Belediye İletişim
                    </span>
                </a>
                <a
                    className="flex items-center gap-3 rounded-xl border border-[#e7cfd0] bg-white p-4 transition-all hover:bg-gray-50 hover:shadow-sm dark:border-[#3a1d1e] dark:bg-[#2a1516] dark:hover:bg-[#33181a]"
                    href="#"
                >
                    <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                        help
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        Destek &amp; Yardım
                    </span>
                </a>
            </div>
            <div className="mt-4 rounded-xl bg-gradient-to-br from-[#ed2630]/10 to-transparent p-6 dark:from-[#ed2630]/20">
                <h3 className="mb-2 text-lg font-bold text-[#ed2630]">
                    Desteğe mi ihtiyacınız var?
                </h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                    Yönetim paneli kullanımı hakkında sorularınız için teknik
                    ekibimize ulaşabilirsiniz.
                </p>
                <button className="w-full rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#ed2630] shadow-sm ring-1 ring-inset ring-gray-200 transition-colors hover:bg-gray-50 dark:bg-[#3a1d1e] dark:ring-[#4a2d2e] dark:hover:bg-[#4a2d2e]">
                    Destek Talebi Oluştur
                </button>
            </div>
        </div>
    );
}
