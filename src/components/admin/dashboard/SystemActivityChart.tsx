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
            date: format(date, "d MMM", { locale: tr }),
            activity: Math.floor(Math.random() * 100) + 50 + (i % 7) * 10,
        });
    }
    return data;
};

export function SystemActivityChart() {
    const data = useMemo(() => generateData(), []);

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Genel Sistem Aktivitesi</h3>
                    <p className="text-sm text-gray-400 font-light">Son 30 günlük site etkileşimi</p>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ed2630" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#ed2630" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9ca3af", fontSize: 12 }}
                            dy={10}
                            interval={4}
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
                            itemStyle={{ color: "#ed2630", fontSize: "13px" }}
                            cursor={{ stroke: "#ed2630", strokeWidth: 1, strokeDasharray: "4 4" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="activity"
                            stroke="#ed2630"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorActivity)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: "#ed2630" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
