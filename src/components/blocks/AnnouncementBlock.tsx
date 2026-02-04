import { Megaphone, ArrowRight, CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AnnouncementBlockProps {
    data: {
        variant: "single" | "list";
        title?: string;
        text?: string;
        items?: Array<{
            title: string;
            date?: string;
            text: string;
            link?: string;
        }>;
    };
}

export function AnnouncementBlock({ data }: AnnouncementBlockProps) {
    if (data.variant === "single") {
        return (
            <div className="max-w-5xl mx-auto px-4">
                <div className="relative p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group">
                    {/* Visual accent - Left border bar - Using Brand Green */}
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#98EB94]"></div>

                    {/* Background decoration */}
                    <div className="absolute -top-24 -right-24 size-64 bg-primary/5 rounded-full blur-3xl transition-all duration-700 group-hover:bg-primary/10"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                        <div className="size-20 rounded-3xl bg-[#98EB94] text-[#164213] flex items-center justify-center shrink-0 shadow-lg shadow-[#98EB94]/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            <Megaphone size={40} weight="fill" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3 text-[#2D5A27] font-bold tracking-widest uppercase text-xs">
                                Önemli Duyuru
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight leading-tight">
                                {data.title}
                            </h3>
                            {data.text && (
                                <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
                                    {data.text}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-10">
                <span className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(237,38,48,0.3)]"></span>
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Güncel Bilgilendirmeler</h2>
            </div>

            <div className="grid gap-6">
                {data.items?.map((item, index) => (
                    <div
                        key={index}
                        className="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1">
                                {item.date && (
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                                        <CalendarBlank size={16} />
                                        {item.date}
                                    </div>
                                )}
                                <h4 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-primary rounded-full shrink-0"></span>
                                    {item.title}
                                </h4>
                                <p className="text-slate-600 leading-relaxed text-base">
                                    {item.text}
                                </p>
                            </div>
                            {item.link && (
                                <Link
                                    href={item.link}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-red-700 shadow-md shadow-primary/20 transition-all duration-300"
                                >
                                    Detayları Gör
                                    <ArrowRight size={18} weight="bold" />
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
