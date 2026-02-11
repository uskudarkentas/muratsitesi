"use client";

import { AdminSidebar } from "@/components/admin/dashboard/AdminSidebar";
import { TransformationStatus } from "@/components/admin/dashboard/TransformationStatus";
import { DashboardMetrics } from "@/components/admin/dashboard/DashboardMetrics";
import { SystemActivityChart } from "@/components/admin/dashboard/SystemActivityChart";
import { RecentActivityList } from "@/components/admin/dashboard/RecentActivityList";
import { PageViewTracker } from "@/components/PageViewTracker";
import { MobileNavigation } from "@/components/admin/mobile/MobileNavigation";

export default function AdminDashboardPage() {
    return (
        <>
            <PageViewTracker />
            <div className="flex h-screen w-full overflow-hidden bg-gray-50/50 relative font-sans">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col overflow-y-auto relative">
                    <main className="flex flex-1 flex-col gap-6 md:gap-8 p-6 md:p-10 max-w-[1600px] mx-auto w-full pb-24 md:pb-10">
                        {/* Transformation Status (Hero) */}
                        <section>
                            <TransformationStatus />
                        </section>

                        {/* Metrics Grid */}
                        <section>
                            <DashboardMetrics />
                        </section>

                        {/* Charts & Activity */}
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[450px]">
                            {/* Main Chart - Takes 2 cols */}
                            <div className="lg:col-span-2 h-[400px] lg:h-full">
                                <SystemActivityChart />
                            </div>

                            {/* Recent Activity - Takes 1 col */}
                            <div className="lg:col-span-1 h-[400px] lg:h-full">
                                <RecentActivityList />
                            </div>
                        </section>
                    </main>
                </div>
            </div>
            {/* Mobile Navigation */}
            <MobileNavigation />
        </>
    );
}
