import { cn } from "@/lib/utils";
import * as Icons from "@phosphor-icons/react/dist/ssr";

interface InfoCardsBlockProps {
    data: {
        cards: Array<{
            icon?: string;
            title: string;
            description: string;
        }>;
        columns?: number;
    };
}

export function InfoCardsBlock({ data }: InfoCardsBlockProps) {
    const columns = data.columns || 3;

    return (
        <div className="max-w-5xl mx-auto px-4">
            <div className={cn(
                "grid gap-6 md:gap-8",
                columns === 1 && "grid-cols-1 max-w-2xl mx-auto",
                columns === 2 && "grid-cols-1 md:grid-cols-2",
                columns === 3 && "grid-cols-1 md:grid-cols-3",
                columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            )}>
                {data.cards.map((card, index) => {
                    // Dynamic icon fetch if string matches a Phosphor icon name
                    const IconComponent = card.icon && (Icons as any)[card.icon] ? (Icons as any)[card.icon] : Icons.Cube;

                    return (
                        <div
                            key={index}
                            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500 group"
                        >
                            <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                <IconComponent size={32} weight="duotone" />
                            </div>
                            <h4 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full shrink-0"></span>
                                {card.title}
                            </h4>
                            <p className="text-slate-600 leading-relaxed text-base">
                                {card.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
