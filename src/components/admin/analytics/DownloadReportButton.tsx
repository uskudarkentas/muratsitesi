"use client";

import { Download } from "lucide-react";
import { downloadDashboardAsPDF } from "@/lib/reportUtils";

interface DownloadReportButtonProps {
    targetId: string;
    fileName: string;
    label?: string;
}

export function DownloadReportButton({ targetId, fileName, label = "Raporu İndir" }: DownloadReportButtonProps) {
    return (
        <button
            onClick={() => downloadDashboardAsPDF(targetId, fileName)}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center gap-2"
            title="Raporu PDF olarak indir"
        >
            <Download size={16} />
            {label}
        </button>
    );
}
