"use client";

import { Eye, MessageCircle, MoreHorizontal } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const posts = [
    {
        id: 1,
        title: "Riskli Yapı Oylaması Başladı",
        date: "10 Şub 2026",
        views: 842,
        comments: 45,
        status: "Published",
        trend: [10, 25, 40, 35, 50, 65, 80]
    },
    {
        id: 2,
        title: "Dış Cephe Renk Seçimi Anketi",
        date: "08 Şub 2026",
        views: 620,
        comments: 124,
        status: "Published",
        trend: [5, 15, 30, 45, 40, 60, 55]
    },
    {
        id: 3,
        title: "Ocak Ayı Aidat Bilgilendirmesi",
        date: "01 Şub 2026",
        views: 415,
        comments: 8,
        status: "Archived",
        trend: [60, 50, 30, 20, 10, 5, 2]
    },
    {
        id: 4,
        title: "Otopark Düzenlemesi Hakkında",
        date: "25 Oca 2026",
        views: 950,
        comments: 62,
        status: "Published",
        trend: [20, 40, 60, 80, 75, 85, 90]
    },
    {
        id: 5,
        title: "Güvenlik Personeli Değişikliği",
        date: "20 Oca 2026",
        views: 320,
        comments: 14,
        status: "Draft",
        trend: [0, 0, 0, 0, 0, 0, 0]
    }
];

export function RecentPostsTable() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Son Gönderiler</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Tümünü Gör</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                            <th className="px-6 py-4 font-medium">Başlık</th>
                            <th className="px-6 py-4 font-medium">Tarih</th>
                            <th className="px-6 py-4 font-medium">Durum</th>
                            <th className="px-6 py-4 font-medium text-center">Görüntülenme</th>
                            <th className="px-6 py-4 font-medium text-center">Etkileşim</th>
                            <th className="px-6 py-4 font-medium text-right">Trend</th>
                            <th className="px-6 py-4 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors cursor-pointer">
                                        {post.title}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{post.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${post.status === "Published"
                                            ? "bg-green-50 text-green-700 border-green-100"
                                            : post.status === "Draft"
                                                ? "bg-gray-100 text-gray-700 border-gray-200"
                                                : "bg-amber-50 text-amber-700 border-amber-100"
                                        }`}>
                                        {post.status === "Published" ? "Yayında" : post.status === "Draft" ? "Taslak" : "Arşiv"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 text-center font-medium">
                                    <div className="flex items-center justify-center gap-1">
                                        <Eye size={14} className="text-gray-400" />
                                        {post.views}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <MessageCircle size={14} className="text-gray-400" />
                                        {post.comments}
                                    </div>
                                </td>
                                <td className="px-6 py-4 w-32">
                                    <div className="h-8 w-24 ml-auto">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={post.trend.map((val, i) => ({ val }))}>
                                                <Area
                                                    type="monotone"
                                                    dataKey="val"
                                                    stroke={post.status === "Published" ? "#10b981" : "#9ca3af"}
                                                    strokeWidth={1.5}
                                                    fill={post.status === "Published" ? "#d1fae5" : "#f3f4f6"}
                                                    fillOpacity={0.4}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
