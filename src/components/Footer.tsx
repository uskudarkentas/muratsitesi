export default function Footer() {
    return (
        <footer className="w-full bg-card border-t border-border py-4 px-6 lg:px-12 mt-auto z-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    {/* Left side - Copyright & Info */}
                    <div>
                        <p className="text-xs text-gray-500 font-medium">
                            © 2026 Üsküdar Belediyesi & KENTAŞ
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                            Kentsel Dönüşüm Bilgi Sistemi · Bilgiler bilgilendirme amaçlıdır.
                        </p>
                    </div>

                    {/* Center - Hotline (Optional) */}
                    <div className="hidden md:block">
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-default">
                            <span className="material-symbols-outlined text-[14px]">call</span>
                            Danışma Hattı: 444 0 875
                        </p>
                    </div>

                    {/* Right side - Links */}
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-[10px] md:text-xs text-gray-500">
                        <a href="https://www.uskudar.bel.tr" target="_blank" rel="noopener noreferrer" className="hover:text-[#ed2630] transition-colors">Üsküdar Belediyesi</a>
                        <span className="text-gray-300">·</span>
                        <a href="https://kentas.com.tr" target="_blank" rel="noopener noreferrer" className="hover:text-[#ed2630] transition-colors">KENTAŞ</a>
                        <span className="text-gray-300">·</span>
                        <span className="hover:text-[#ed2630] transition-colors cursor-pointer">KVKK</span>
                        <span className="text-gray-300">·</span>
                        <a href="https://www.uskudar.bel.tr/iletisim" target="_blank" rel="noopener noreferrer" className="hover:text-[#ed2630] transition-colors">İletişim</a>
                        <span className="text-gray-300">·</span>
                        <span className="hover:text-[#ed2630] transition-colors cursor-pointer">SSS</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
