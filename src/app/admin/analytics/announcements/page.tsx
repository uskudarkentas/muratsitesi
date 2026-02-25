import { StatsCards } from "@/components/admin/analytics/StatsCards";
import { EngagementChart } from "@/components/admin/analytics/EngagementChart";
import { RecentPostsTable } from "@/components/admin/analytics/RecentPostsTable";
import { AdminSidebar } from "@/components/admin/dashboard/AdminSidebar";
import { PageViewTracker } from "@/components/PageViewTracker";
import { MobileNavigation } from "@/components/admin/mobile/MobileNavigation";
import { getDeviceStats } from "@/lib/actions/analytics";
import DeviceDistributionCard from "@/components/DeviceDistributionCard";
import { DownloadReportButton } from "@/components/admin/analytics/DownloadReportButton";

import { downloadDashboardAsPDF } from "@/lib/reportUtils";

export default async function AnalyticsDashboardPage() {
    const deviceStats = await getDeviceStats("DUYURU");

    return (
        <>
            <PageViewTracker />
            <div className="flex h-screen w-full overflow-hidden bg-gray-50/50 relative font-sans">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col overflow-y-auto relative">
                    <main id="analytics-report-content" className="flex flex-1 flex-col gap-8 p-6 md:p-10 max-w-[1600px] mx-auto w-full pb-24 md:pb-10">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                    Duyuru Analizleri
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    Duyuru performansı ve sakinlerin etkileşim raporları
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <DownloadReportButton
                                    targetId="analytics-report-content"
                                    fileName="Duyuru_Analiz_Raporu"
                                />
                            </div>
                        </div>

                        {/* Top Row: Stats Cards */}
                        <section>
                            <StatsCards />
                        </section>

                        {/* Middle Row: Charts */}
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[400px]">
                            {/* Main Chart - Takes 2 cols */}
                            <div className="lg:col-span-2 h-[400px] lg:h-full">
                                <EngagementChart color="#3b82f6" />
                            </div>

                            {/* Side Chart - Takes 1 col */}
                            <div className="lg:col-span-1 h-[300px] lg:h-full">
                                <DeviceDistributionCard {...deviceStats} className="h-full" />
                            </div>
                        </section>

                        {/* Bottom Row: Data Table */}
                        <section>
                            <RecentPostsTable />
                        </section>
                    </main>
                </div>
            </div>
            {/* Mobile Navigation */}
            <MobileNavigation />
        </>
    );
}
