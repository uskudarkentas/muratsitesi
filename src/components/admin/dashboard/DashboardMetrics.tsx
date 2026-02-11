"use client";

import { Users, Eye, FileText, Share2, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatProps {
    title: string;
    value: string;
    trend: string;
    icon: any;
    colorClass: string;
}

function MetricCard({ title, value, trend, icon: Icon, colorClass }: StatProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-xl", colorClass)}>
                    <Icon size={20} className="text-gray-700" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full text-emerald-700 bg-emerald-50">
                    <ArrowUpRight size={14} />
                    <span>{trend}</span>
                </div>
            </div>

            <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <span className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
            </div>
        </div>
    );
}

export function DashboardMetrics() {
    const metrics = [
        {
            title: "Toplam Malik",
            value: "1,240",
            trend: "+12 bu hafta",
            icon: Users,
            colorClass: "bg-blue-50 text-blue-600"
        },
        {
            title: "Sayfa Görüntüleme",
            value: "45.2K",
            trend: "+8.5% artış",
            icon: Eye,
            colorClass: "bg-indigo-50 text-indigo-600"
        },
        {
            title: "Anket Katılımı",
            value: "85%",
            trend: "Aktif",
            icon: FileText,
            colorClass: "bg-amber-50 text-amber-600"
        },
        {
            title: "Toplam Paylaşım",
            value: "320",
            trend: "+2% artış",
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
