import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    MapPin,
    Phone,
    Printer,
    Mail,
    ExternalLink,
    User,
    ArrowRight,
    Clock,
    Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "İletişim | Merkez Kentsel Dönüşüm Bilgilendirme Ofisi",
    description: "Üsküdar Merkez Kentsel Dönüşüm Bilgilendirme Ofisi iletişim bilgileri. Adres, telefon, e-posta ve çözüm hattı.",
};

export default function ContactPage() {
    const kentasInfo = "Üsküdar Yenileniyor, Üsküdar'da bulunan riskli yapıların depreme dayanıklı hale getirilmesini ve yeni konutların inşa edilmesini amaçlayan online bilgilendirme ve destek platformudur. Platform, Üsküdar Belediyesi iştiraki KENTAŞ öncülüğünde yürütülmektedir.";

    const contactInfo = [
        {
            icon: MapPin,
            label: "Adres",
            value: "Mimar Sinan Mah. Çavuşdere Cad. No: 35 Üsküdar/İstanbul",
            href: "https://maps.google.com/?q=Mimar+Sinan+Mah.+Çavuşdere+Cad.+No:+35+Üsküdar/İstanbul",
            isLink: true
        },
        {
            icon: Phone,
            label: "Çözüm Hattı",
            value: "444 0 875",
            href: "tel:4440875",
            isLink: true
        },
        {
            icon: Phone,
            label: "Telefon",
            value: "+90 (216) 531 30 00",
            href: "tel:+902165313000",
            isLink: true
        },
        {
            icon: Printer,
            label: "Faks",
            value: "+90 (216) 531 32 25",
            href: null,
            isLink: false
        },
        {
            icon: Mail,
            label: "E-Posta",
            value: "superhizmet@uskudar.bel.tr",
            href: "mailto:superhizmet@uskudar.bel.tr",
            isLink: true
        }
    ];

    return (
        <div className="flex h-screen flex-col bg-slate-50 font-sans overflow-hidden">
            <Header />

            <div className="flex-1 overflow-y-auto w-full flex flex-col no-scrollbar">
                <main className="flex-1 flex flex-col md:justify-center py-6 md:py-10">

                    {/* Simple Text Header (Hero removed) */}
                    <div className="pb-4">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
                            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none mb-3">
                                İletişim
                            </h1>
                            <p className="text-slate-500 text-lg font-light max-w-2xl">
                                Merkez Kentsel Dönüşüm Bilgilendirme Ofisi ile iletişime geçin.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">

                            {/* --- ROW 1 --- */}

                            {/* About Card (Left - 2 Cols) */}
                            <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                        Hakkımızda
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed text-base">
                                        {kentasInfo}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-4 border-t border-slate-50">
                                    <a
                                        href="https://uskudarkentas.com.tr/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-600 font-medium hover:bg-slate-100 transition-colors text-sm"
                                    >
                                        KENTAŞ Web Sitesi
                                        <ExternalLink size={16} strokeWidth={1.5} />
                                    </a>
                                    <a
                                        href="https://www.uskudaryenileniyor.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-600 font-medium hover:bg-slate-100 transition-colors text-sm"
                                    >
                                        Üsküdar Yenileniyor
                                        <ExternalLink size={16} strokeWidth={1.5} />
                                    </a>
                                </div>
                            </div>

                            {/* Working Hours Card (Right - 1 Col) - White Style */}
                            <div className="lg:col-span-1 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 text-slate-400 mb-6">
                                        <Clock size={24} className="text-primary" />
                                        <span className="text-sm font-bold tracking-widest uppercase">Zaman Çizelgesi</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Çalışma Saatleri</h3>

                                    <div className="space-y-4 font-light text-slate-600">
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                            <span>Hafta İçi</span>
                                            <span className="font-semibold text-[#164213] bg-[#98EB94]/20 px-2 py-0.5 rounded">08:30 - 17:00</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 text-slate-400">
                                            <span>Hafta Sonu</span>
                                            <span>Kapalı</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 bg-slate-50 rounded-xl p-3 relative z-10">
                                    <p className="text-xs text-slate-500 text-center">
                                        Öğle arası 12:30 - 13:30
                                    </p>
                                </div>
                            </div>

                            {/* --- ROW 2 --- */}

                            {/* Contact Responsible (Left - 1 Col) */}
                            <div className="lg:col-span-1 bg-primary text-white rounded-[2rem] p-8 shadow-xl shadow-primary/20 h-auto lg:h-full flex flex-col relative group hover:shadow-primary/30 transition-all duration-300">
                                {/* Abstract Background Pattern */}
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/15 transition-colors duration-500"></div>
                                <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/20 to-transparent"></div>

                                <div className="relative z-10 flex-1 flex flex-col">
                                    <div className="flex items-center gap-3 mb-6 text-white/90 font-medium uppercase tracking-wide text-xs bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                        <User size={14} />
                                        İletişim Sorumlusu
                                    </div>

                                    <h3 className="text-3xl font-bold mb-1 leading-tight tracking-tight">
                                        Demet Zeynep <br /> ÇİFTÇİ
                                    </h3>
                                    <p className="text-white/80 text-lg font-light mb-8">
                                        Kentsel Dönüşüm Uzmanı
                                    </p>

                                    <div className="mt-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-default shadow-inner shadow-white/5">
                                        <div className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-2">Doğrudan İletişim</div>
                                        <div className="flex flex-col gap-1">
                                            <a href="tel:4440875" className="text-3xl font-bold tracking-tight hover:text-white transition-colors">444 0 875</a>
                                            <span className="text-white/80 font-medium flex items-center gap-2 text-sm bg-white/10 w-fit px-2 py-0.5 rounded">
                                                Dahili: <span className="font-bold text-white">3018</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Channels Grid (Right - 2 Cols) */}
                            <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                                <h3 className="text-xl font-semibold text-slate-800 mb-8 border-b border-slate-100 pb-4 relative z-10">
                                    İletişim Kanalları
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-y-8 gap-x-8 relative z-10">
                                    {contactInfo.map((item, index) => (
                                        <div key={index} className={cn("group", index === 0 ? "sm:col-span-2" : "")}>
                                            <div className="flex items-center gap-2.5 text-slate-400 font-medium text-xs uppercase tracking-widest mb-1.5">
                                                <item.icon size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                                                {item.label}
                                            </div>
                                            {item.isLink ? (
                                                <a
                                                    href={item.href || "#"}
                                                    className="block text-lg md:text-xl font-medium text-slate-800 hover:text-primary transition-colors"
                                                    target={item.label === "Adres" ? "_blank" : "_self"}
                                                    rel="noopener noreferrer"
                                                >
                                                    {item.value}
                                                    {item.label === "Adres" && index === 0 && (
                                                        <ArrowRight size={18} className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                                    )}
                                                </a>
                                            ) : (
                                                <div className="text-lg md:text-xl font-medium text-slate-800">
                                                    {item.value}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
