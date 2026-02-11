"use client";

import { useMemo } from "react";
import { Cell, Doughnut, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
    { name: "Mobil", value: 68 },
    { name: "Masaüstü", value: 24 },
    { name: "Tablet", value: 8 },
];

const COLORS = ["#ef4444", "#374151", "#9ca3af"]; // Red, Charcoal, Gray

export function DeviceDistributionChart() {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cihaz Dağılımı</h3>
            <p className="text-sm text-gray-400 font-light mb-6">Kullanıcıların erişim sağladığı cihazlar</p>

            <div className="flex-1 min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                            }}
                            itemStyle={{ color: "#374151", fontWeight: 500 }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value, entry: any) => (
                                <span className="text-sm text-gray-600 font-medium ml-1">{value} ({entry.payload.value}%)</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                    <div className="text-center">
                        <span className="block text-3xl font-bold text-gray-800">1240</span>
                        <span className="text-xs text-gray-400 uppercase tracking-widest">Toplam</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
