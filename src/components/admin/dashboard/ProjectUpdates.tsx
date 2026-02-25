"use client";

import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
    FileText,
    CheckCircle,
    RefreshCw,
    Zap,
    AlertCircle
} from "lucide-react";
import { getProjectUpdates } from "@/lib/actions/project-updates";
import { cn } from "@/lib/utils";

// Define locally since we are replacing SystemLog types
export enum ProjectUpdateType {
    EKLENDI = "EKLENDI",
    GUNCELLENDI = "GUNCELLENDI",
    YAYINLANDI = "YAYINLANDI",
    TAMAMLANDI = "TAMAMLANDI",
}

export type ProjectUpdateItem = {
    id: string;
    title: string;
    description: string;
    type: string;
    category: string;
    createdAt: Date;
};

export function ProjectUpdates() {
    const [updates, setUpdates] = useState<ProjectUpdateItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUpdates() {
            try {
                const data = await getProjectUpdates(5);
                console.log("Component received:", data);
                setUpdates(data);
            } catch (error) {
                console.error("Failed to load project updates", error);
                setErrorMsg("Failed to load");
            } finally {
                setLoading(false);
            }
        }
        fetchUpdates();
    }, []);

    const getTypeConfig = (type: string) => {
        switch (type) {
            case ProjectUpdateType.EKLENDI:
                return {
                    icon: <Zap size={16} />,
                    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
                    label: "Eklendi"
                };
            case ProjectUpdateType.GUNCELLENDI:
                return {
                    icon: <RefreshCw size={16} />,
                    color: "text-blue-600 bg-blue-50 border-blue-100",
                    label: "Güncellendi"
                };
            case ProjectUpdateType.YAYINLANDI:
                return {
                    icon: <FileText size={16} />,
                    color: "text-violet-600 bg-violet-50 border-violet-100",
                    label: "Yayınlandı"
                };
            case ProjectUpdateType.TAMAMLANDI:
                return {
                    icon: <CheckCircle size={16} />,
                    color: "text-orange-600 bg-orange-50 border-orange-100",
                    label: "Tamamlandı"
                };
            default:
                return {
                    icon: <AlertCircle size={16} />,
                    color: "text-gray-600 bg-gray-50 border-gray-100",
                    label: type
                };
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">Son Gönderiler</h3>
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                {updates.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">Henüz gönderi yok</div>
                ) : (
                    updates.map((update) => {
                        const config = getTypeConfig(update.type);

                        return (
                            <div key={update.id} className="group flex gap-3 p-2 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors",
                                    config.color
                                )}>
                                    {React.cloneElement(config.icon as React.ReactElement, { size: 14 })}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h4 className="font-semibold text-gray-900 text-xs truncate pr-1">
                                            {update.title}
                                        </h4>
                                        <span className="text-[9px] text-gray-400 font-medium whitespace-nowrap bg-white px-1.5 py-0.5 rounded-full border border-gray-100">
                                            {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true, locale: tr })}
                                        </span>
                                    </div>

                                    <p className="text-[11px] text-gray-500 leading-tight line-clamp-1 mb-1.5">
                                        {update.description}
                                    </p>

                                    <div className="flex items-center gap-1.5">
                                        <span className={cn(
                                            "text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide",
                                            config.color
                                        )}>
                                            {config.label}
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-medium px-1.5 py-0.5 bg-gray-100 rounded-md">
                                            {update.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
