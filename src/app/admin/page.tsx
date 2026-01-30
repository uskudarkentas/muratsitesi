import { AdminSidebar } from "@/components/admin/dashboard/AdminSidebar";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";
import { RecentActivity } from "@/components/admin/dashboard/RecentActivity";
import { PageViewTracker } from "@/components/PageViewTracker";
import { MobileNavigation } from "@/components/admin/mobile/MobileNavigation";

export default function AdminDashboardPage() {
    return (
        <>
            <PageViewTracker />
            <div className="flex h-screen w-full overflow-hidden bg-background relative">
                {/* Noise texture overlay - same as homepage */}
                <div
                    className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                        backgroundRepeat: "repeat",
                    }}
                ></div>

                {/* Sidebar - Hidden on mobile (md:flex) */}
                <AdminSidebar />

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col overflow-y-auto relative">
                    {/* Spotlight gradient - same as homepage */}
                    <div className="absolute inset-0 flex justify-center pointer-events-none">
                        <div
                            className="w-full max-w-3xl h-full"
                            style={{
                                background:
                                    "radial-gradient(circle at center, rgba(152, 235, 148, 0.05) 0%, transparent 70%)",
                            }}
                        ></div>
                    </div>

                    <DashboardHeader />

                    {/* Main content with bottom padding for mobile nav */}
                    <main className="flex flex-1 flex-col gap-6 md:gap-8 p-4 md:p-10 lg:p-12 max-w-7xl mx-auto w-full pb-20 md:pb-6">
                        {/* Page Heading - Match homepage typography */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl md:text-2xl font-bold text-[#46474A] tracking-tight">
                                Hoşgeldiniz, Yönetici
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl">
                                Site yönetim paneline genel bakış. Buradan duyuru
                                yayınlayabilir, sakinleri bilgilendirebilir ve
                                kentsel dönüşüm sürecini yönetebilirsiniz.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <DashboardStats />

                        {/* Quick Actions (Main focus) */}
                        <QuickActions />

                        {/* Recent Activity - Full Width */}
                        <RecentActivity />
                    </main>
                </div>
            </div>

            {/* Mobile Navigation (BottomNav + SideDrawer) */}
            <MobileNavigation />
        </>
    );
}
