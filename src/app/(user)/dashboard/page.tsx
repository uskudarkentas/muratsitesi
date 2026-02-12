import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { postService } from "@/features/posts/services/postService";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UserDashboardPage() {
    const upcomingEvents = await postService.getUpcomingEvents();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50/50">
            <Header />

            <main className="flex-1 container mx-auto px-6 py-12 max-w-5xl">
                {/* Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Hoş Geldiniz</h1>
                    <p className="text-slate-500">Murat Sitesi Kentsel Dönüşüm sürecindeki güncel gelişmeleri buradan takip edebilirsiniz.</p>
                </div>

                {/* Upcoming Events Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">calendar_month</span>
                            Yaklaşan Etkinlikler
                        </h2>
                    </div>

                    {upcomingEvents.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-slate-300 !text-3xl">event_busy</span>
                            </div>
                            <p className="text-slate-500 font-medium">Şu an planlanmış etkinlik yok</p>
                            <p className="text-slate-400 text-sm mt-1">Yeni etkinlikler eklendiğinde burada görünecektir.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {upcomingEvents.map((event) => {
                                const isMeeting = event.type === 'MEETING';
                                const displayDate = event.eventDate || event.expiresAt;

                                return (
                                    <div key={event.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex gap-4 group cursor-default">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                            isMeeting ? "bg-purple-50 text-purple-600 group-hover:bg-purple-100" : "bg-orange-50 text-orange-600 group-hover:bg-orange-100"
                                        )}>
                                            <span className="material-symbols-outlined">
                                                {isMeeting ? 'groups' : 'poll'}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase tracking-wider",
                                                    isMeeting ? "text-purple-500" : "text-orange-500"
                                                )}>
                                                    {isMeeting ? 'Toplantı' : 'Anket'}
                                                </span>
                                                <span className="text-slate-300 text-[8px]">•</span>
                                                <span className="text-slate-400 text-[11px] font-medium">
                                                    {displayDate ? format(new Date(displayDate), 'd MMMM yyyy', { locale: tr }) : 'Tarih belirtilmedi'}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-slate-800 leading-tight mb-1 truncate group-hover:text-primary transition-colors">
                                                {event.title}
                                            </h3>

                                            <p className="text-slate-500 text-sm line-clamp-2 leading-snug">
                                                {/* Logic to extract text from Editor.js content if needed, otherwise generic */}
                                                Ayrıntılar için aşama detaylarını ziyaret edin.
                                            </p>
                                        </div>

                                        <div className="self-center">
                                            <Link
                                                href={`/asamalar/${event.stageId}`}
                                                className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:text-primary hover:border-primary/30 transition-all"
                                            >
                                                <span className="material-symbols-outlined !text-[18px]">chevron_right</span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Quick Info / Tips Section */}
                <div className="mt-16 grid gap-6 md:grid-cols-3">
                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                        <span className="material-symbols-outlined text-primary mb-3">lightbulb</span>
                        <h4 className="font-bold text-slate-800 mb-2">Bilgi</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">Süreçle ilgili tüm resmi duyurulara ana sayfadaki zaman çizelgesinden ulaşabilirsiniz.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                        <span className="material-symbols-outlined text-blue-500 mb-3">contact_support</span>
                        <h4 className="font-bold text-slate-800 mb-2">Destek</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">Aklınıza takılan sorular için iletişim sayfamızdan bize ulaşabilirsiniz.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200">
                        <span className="material-symbols-outlined text-slate-500 mb-3">verified</span>
                        <h4 className="font-bold text-slate-800 mb-2">Resmiyet</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">Bu platform Murat Sitesi kentsel dönüşüm sürecinin resmi bilgilendirme kanalıdır.</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
