"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface DeviceDistributionProps {
    total: number;
    desktop: number;
    mobile: number;
    tablet: number;
    className?: string;
}

const DeviceDistributionCard: React.FC<DeviceDistributionProps> = ({
    total,
    desktop,
    mobile,
    tablet,
    className,
}) => {
    const data = [
        { name: "Mobil", value: mobile, color: "#3b82f6" },
        { name: "Masaüstü", value: desktop, color: "#1e293b" },
        { name: "Tablet", value: tablet, color: "#cbd5e1" },
    ];

    // Filter out zero values for the chart
    const chartData = data.filter((item) => item.value > 0);

    const hasData = total > 0;

    return (
        <div
            className={cn(
                "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full",
                className
            )}
        >
            <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-900">Cihaz Dağılımı</h3>
                <p className="text-sm text-gray-400 font-light">Kullanıcıların erişim sağladığı cihazlar</p>
            </div>

            {!hasData ? (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm min-h-[200px]">
                    Veri Henüz Toplanmadı
                </div>
            ) : (
                <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-4 min-h-[200px]">
                    {/* Donut Chart with Center Text */}
                    <div className="relative w-[180px] h-[180px] flex-shrink-0 mx-auto md:mx-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                    isAnimationActive={true}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number, name: string) => [
                                        `${value} (${((value / total) * 100).toFixed(0)}%)`,
                                        name
                                    ]}
                                    contentStyle={{
                                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                    itemStyle={{ color: "#374151", fontWeight: 500 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center Text (Total) */}
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="block text-2xl font-bold text-gray-800">{total}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">TOPLAM</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-col gap-3 flex-1 w-full md:w-auto pl-0 md:pl-4">
                        {data.map((item) => {
                            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                            return (
                                <div key={item.name} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-gray-600 text-sm font-medium">
                                            {item.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-900 text-sm font-bold">
                                            {percentage}%
                                        </span>
                                        <span className="text-gray-400 text-xs">
                                            ({item.value})
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeviceDistributionCard;
