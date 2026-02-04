import { cn } from "@/lib/utils";

interface HeroBlockProps {
    data: {
        title: string;
        description?: string;
        accentColor?: string;
        layout?: "full" | "centered" | "narrow" | "card";
    };
}

export function HeroBlock({ data }: HeroBlockProps) {
    const isCard = data.layout === "card";

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className={cn(
                "max-w-5xl mx-auto px-4 text-center md:text-left",
                data.layout === "narrow" && "max-w-2xl"
            )}>
                <h1 className="flex flex-col gap-3 mb-10 group">
                    {(() => {
                        const parts = data.title.split(/[:\u2014-]/);
                        if (parts.length > 1) {
                            return (
                                <>
                                    <span className="flex items-center gap-3 text-primary font-bold tracking-[0.2em] uppercase text-xs md:text-sm animate-in fade-in slide-in-from-left-6 duration-1000">
                                        <span className="w-12 h-[2px] bg-primary rounded-full"></span>
                                        {parts[0].trim()}
                                    </span>
                                    <span className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none group-hover:translate-x-1 transition-transform duration-500">
                                        {parts.slice(1).join("").trim()}
                                    </span>
                                </>
                            );
                        }
                        return (
                            <span className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none">
                                {data.title}
                            </span>
                        );
                    })()}
                </h1>

                {data.description && (
                    <div className={cn(
                        "relative",
                        isCard ? "bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50" : "max-w-3xl"
                    )}>
                        {!isCard && (
                            <div className="absolute -left-6 top-0 bottom-0 w-[1px] bg-slate-200 hidden md:block"></div>
                        )}
                        <p className={cn(
                            "leading-relaxed",
                            isCard ? "text-slate-600 text-lg font-normal" : "text-slate-500 text-xl font-light"
                        )}>
                            {data.description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
