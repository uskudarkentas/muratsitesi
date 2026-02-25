import { Users, Eye, FileText, Share2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardStats } from "@/lib/actions/stats";

interface StatProps {
    title: string;
    value: string;
    trend: string;
    trendType: 'up' | 'down' | 'neutral';
    icon: any;
    colorClass: string;
}

function MetricCard({ title, value, trend, trendType, icon: Icon, colorClass }: StatProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-xl", colorClass)}>
                    <Icon size={20} className="text-gray-700" />
                </div>
                {(trend !== '0' && !trend.includes('0%') && !trend.includes('+0')) ? (
                    <div className={cn(
                        "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                        trendType === 'up' && "text-emerald-700 bg-emerald-50",
                        trendType === 'down' && "text-red-700 bg-red-50",
                        trendType === 'neutral' && "text-gray-700 bg-gray-50"
                    )}>
                        {trendType === 'up' ? <ArrowUpRight size={14} /> : trendType === 'down' ? <ArrowDownRight size={14} /> : null}
                        <span>{trend}</span>
                    </div>
                ) : (
                    <div className="h-6"></div> // Spacer to keep alignment or just empty
                )}
            </div>

            <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <span className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
            </div>
        </div>
    );
}

interface DashboardMetricsProps {
    stats?: DashboardStats;
}

export function DashboardMetrics({ stats }: DashboardMetricsProps) {
    // Default/Loading state if no stats provided
    const defaultStats = {
        totalUsers: "1,240",
        newUsersThisWeek: "+12 bu hafta",
        totalPageViews: "45.2K",
        pageViewsGrowth: "+8.5% artış",
        surveyParticipationRate: "85%",
        totalShares: "320",
        sharesGrowth: "+2% artış"
    };

    // Format numbers
    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K";
        }
        return num.toString();
    };

    const metrics = [
        {
            title: "Toplam Malik",
            value: stats ? stats.totalUsers.toLocaleString('tr-TR') : defaultStats.totalUsers,
            trend: stats ? `+${stats.newUsersThisWeek} bu hafta` : defaultStats.newUsersThisWeek,
            trendType: 'up' as const,
            icon: Users,
            colorClass: "bg-blue-50 text-blue-600"
        },
        {
            title: "Sayfa Görüntüleme",
            value: stats ? formatNumber(stats.totalPageViews) : defaultStats.totalPageViews,
            trend: stats ? `${stats.pageViewsGrowth > 0 ? '+' : ''}${stats.pageViewsGrowth}% artış` : defaultStats.pageViewsGrowth,
            trendType: (stats?.pageViewsGrowth ?? 1) >= 0 ? 'up' as const : 'down' as const,
            icon: Eye,
            colorClass: "bg-indigo-50 text-indigo-600"
        },
        {
            title: "Anket Katılımı",
            value: stats ? `%${stats.surveyParticipationRate}` : defaultStats.surveyParticipationRate,
            trend: "Aktif",
            trendType: 'neutral' as const,
            icon: FileText,
            colorClass: "bg-amber-50 text-amber-600"
        },
        {
            title: "Toplam Paylaşım",
            value: stats ? stats.totalShares.toString() : defaultStats.totalShares,
            trend: stats ? `${stats.sharesGrowth > 0 ? '+' : ''}${stats.sharesGrowth}% artış` : defaultStats.sharesGrowth,
            trendType: (stats?.sharesGrowth ?? 1) >= 0 ? 'up' as const : 'down' as const,
            icon: Share2,
            colorClass: "bg-emerald-50 text-emerald-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
            ))}
        </div>
    );
}
