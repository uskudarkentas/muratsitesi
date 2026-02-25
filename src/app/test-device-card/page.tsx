import React from "react";
import DeviceDistributionCard from "@/components/DeviceDistributionCard";

export default function TestDeviceCardPage() {
    const scenarios = [
        {
            title: "1. Duyuru Analizleri (Mevcut Durum)",
            data: { total: 1240, desktop: 298, mobile: 843, tablet: 99 },
        },
        {
            title: "2. Anket Analizleri (Dış Cephe)",
            data: { total: 850, desktop: 85, mobile: 722, tablet: 43 },
        },
        {
            title: "3. Toplantı Analizleri (Canlı Yayın)",
            data: { total: 410, desktop: 164, mobile: 205, tablet: 41 },
        },
        {
            title: "4. Boş Durum",
            data: { total: 0, desktop: 0, mobile: 0, tablet: 0 },
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <h1 className="text-2xl font-bold mb-8 text-slate-800">
                Device Distribution Card Test
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenarios.map((scenario, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <h2 className="text-sm font-semibold text-slate-500 mb-2">
                            {scenario.title}
                        </h2>
                        <DeviceDistributionCard {...scenario.data} className="h-64" />
                    </div>
                ))}
            </div>
        </div>
    );
}
