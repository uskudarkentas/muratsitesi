"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, subDays } from "date-fns";
import { tr } from "date-fns/locale";

const generateData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
        const date = subDays(new Date(), i);
        data.push({
            date: format(date, "MMM dd", { locale: tr }),
            fullDate: format(date, "d MMMM yyyy", { locale: tr }),
            engagement: Math.floor(Math.random() * 50) + 20 + (i % 7) * 5, // random trend
        });
    }
    return data;
};

export function EngagementChart() {
    const data = useMemo(() => generateData(), []);

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Etkileşim Analizi</h3>
                    <p className="text-sm text-gray-400 font-light">Son 30 günlük etkileşim trendi</p>
                </div>

                {/* Time Range Selector (Mock) */}
                <div className="flex bg-gray-50 rounded-lg p-1">
                    {['7 Gün', '30 Gün', '90 Gün'].map((range, idx) => (
                        <button
                            key={range}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${idx === 1
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9ca3af", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9ca3af", fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                borderRadius: "12px",
                                border: "1px solid #f3f4f6",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                            }}
                            labelStyle={{ color: "#374151", fontWeight: 600, marginBottom: "4px" }}
                            itemStyle={{ color: "#ef4444", fontSize: "13px" }}
                            cursor={{ stroke: "#ef4444", strokeWidth: 1, strokeDasharray: "4 4" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="engagement"
                            stroke="#ef4444"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorEngagement)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: "#ef4444" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
