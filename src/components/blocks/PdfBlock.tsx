import { FileText, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

interface PdfBlockProps {
    data: {
        url: string;
        title: string;
        description?: string;
        fileName?: string;
    };
}

export function PdfBlock({ data }: PdfBlockProps) {
    return (
        <div className="max-w-5xl mx-auto px-4">
            <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-6 p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
                <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <FileText size={32} weight="duotone" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-semibold text-slate-800 group-hover:text-primary transition-colors truncate">
                        {data.title}
                    </h4>
                    {data.description && (
                        <p className="text-slate-500 text-sm mt-1 line-clamp-1 italic">
                            {data.description}
                        </p>
                    )}
                </div>
                <div className="size-12 rounded-full bg-primary text-white shadow-md shadow-primary/20 flex items-center justify-center group-hover:bg-red-700 group-hover:scale-110 transition-all duration-300">
                    <DownloadSimple size={24} weight="bold" />
                </div>
            </a>
        </div>
    );
}
