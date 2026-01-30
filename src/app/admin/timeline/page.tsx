import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminTimeline from "@/components/admin/AdminTimeline";
import Header from "@/components/Header";
import { TimelineProvider } from "@/context/TimelineContext";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";


// Simple auth check - will be replaced with proper auth later

export default async function AdminPage() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("admin_auth");

    if (!authToken) {
        redirect("/admin/login");
    }

    // Fetch stages for Admin Timeline
    const stages = await db.stage.findMany({
        orderBy: { sequenceOrder: 'asc' },
    });

    return (
        <TimelineProvider>
            <main className="flex h-screen flex-col bg-background relative overflow-hidden">
                {/* Noise texture overlay */}
                <div
                    className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                        backgroundRepeat: "repeat",
                    }}
                ></div>

                <Header />

                <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                    {/* Admin Badge */}
                    <div className="absolute top-4 right-4 z-30">
                        <div className="bg-primary/10 border border-primary/30 rounded-full px-4 py-2 flex items-center gap-2">
                            <span className="material-symbols-outlined !text-lg text-primary">
                                admin_panel_settings
                            </span>
                            <span className="text-sm font-semibold text-primary">
                                Yönetici Modu
                            </span>
                        </div>
                    </div>

                    <div className="w-full max-w-screen-2xl mx-auto relative h-full">
                        {/* Main Content - Centered Timeline */}
                        <div className="flex flex-col items-center w-full pt-6 pb-10">
                            {/* Spotlight gradient */}
                            <div className="absolute inset-0 flex justify-center pointer-events-none">
                                <div
                                    className="w-full max-w-3xl h-full"
                                    style={{
                                        background:
                                            "radial-gradient(circle at center, rgba(152, 235, 148, 0.05) 0%, transparent 70%)",
                                    }}
                                ></div>
                            </div>

                            <h1 className="text-xl md:text-2xl font-bold text-[#46474A] mb-8 md:mb-12 text-center px-4 md:px-0 relative z-10 max-w-xl leading-tight">
                                İçerik Yönetimi
                                <br className="md:hidden" /> Murat Sitesi Kentsel
                                Dönüşüm
                            </h1>

                            <AdminTimeline
                                stages={stages as any}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </TimelineProvider>
    );
}
