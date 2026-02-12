"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Building2, Hammer, CheckCircle2, Globe } from "lucide-react";
import Link from "next/link";

const data = [
    { name: "Tamamlanan", value: 45 },
    { name: "Kalan", value: 55 },
];

const COLORS = ["#ed2630", "#f3f4f6"];

export function TransformationStatus() {
    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 h-full">
            {/* Left: Title & Chart */}
            <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={60}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} rounded={10} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tighter">%45</span>
                        </div>
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">TAMAMLANDI</span>
                </div>

                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Dönüşüm Durumu</h2>
                    <p className="text-gray-500 max-w-xs text-sm mb-4">
                        Kentsel dönüşüm sürecindeki genel ilerleme durumu ve bina istatistikleri.
                    </p>
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all w-fit shadow-sm"
                    >
                        <Globe size={16} />
                        Siteyi Görüntüle
                    </Link>
                </div>
            </div>

            {/* Right: Stats Columns */}
            <div className="flex flex-col sm:flex-row gap-6 md:gap-12 w-full md:w-auto">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-xl text-red-600">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">45</div>
                        <div className="text-xs text-gray-500 font-medium">Yıkılan Bina</div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                        <Hammer size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">120</div>
                        <div className="text-xs text-gray-500 font-medium">İnşaat Halinde</div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">210</div>
                        <div className="text-xs text-gray-500 font-medium">Teslim Edilen</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
