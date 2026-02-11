"use client";

import { ArrowUpRight, ArrowDownRight, Users, Share2, BarChart2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatProps {
    title: string;
    value: string;
    trend: number;
    trendLabel: string;
    icon: any;
    colorClass: string;
}

function StatCard({ title, value, trend, trendLabel, icon: Icon, colorClass }: StatProps) {
    const isPositive = trend >= 0;

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-xl", colorClass)}>
                    <Icon size={20} className="text-gray-700" />
                </div>
                {trend !== 0 && (
                    <div className={cn(
                        "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                        isPositive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                    )}>
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
                    <span className="text-xs text-gray-400 font-light">{trendLabel}</span>
                </div>
            </div>
        </div>
    );
}

export function StatsCards() {
    const stats = [
        {
            title: "Okunma Oranı",
            value: "85%",
            trend: 12.5,
            trendLabel: "geçen aya göre",
            icon: Eye,
            colorClass: "bg-blue-50 text-blue-600"
        },
        {
            title: "Toplam Paylaşım",
            value: "124",
            trend: 8.2,
            trendLabel: "geçen aya göre",
            icon: Share2,
            colorClass: "bg-indigo-50 text-indigo-600"
        },
        {
            title: "Ortalama Etkileşim",
            value: "4.2 dk",
            trend: -2.4,
            trendLabel: "geçen aya göre",
            icon: BarChart2,
            colorClass: "bg-amber-50 text-amber-600"
        },
        {
            title: "Aktif Kullanıcılar",
            value: "1,240",
            trend: 24.0,
            trendLabel: "son 30 gün",
            icon: Users,
            colorClass: "bg-emerald-50 text-emerald-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
}
