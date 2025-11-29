import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HabitCalendarProps {
    history: number[]; // Array of timestamps
    variant?: 'full' | 'mini';
}

export const HabitCalendar = ({ history = [], variant = 'full' }: HabitCalendarProps) => {
    // Generate days based on variant
    const daysCount = variant === 'mini' ? 35 : 365; // 5 weeks vs 1 year
    const today = new Date();
    const days = Array.from({ length: daysCount }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - ((daysCount - 1) - i));
        return d;
    });

    // Group by weeks
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    days.forEach((day) => {
        if (day.getDay() === 0 && currentWeek.length > 0) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        currentWeek.push(day);
    });
    if (currentWeek.length > 0) weeks.push(currentWeek);

    const isCompleted = (date: Date) => {
        const dateStr = date.toDateString();
        return history.some(h => new Date(h).toDateString() === dateStr);
    };

    if (variant === 'mini') {
        return (
            <div className="flex gap-1.5 bg-black/20 p-2 rounded-lg">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1.5">
                        {week.map((date, dayIndex) => {
                            const completed = isCompleted(date);
                            return (
                                <div
                                    key={dayIndex}
                                    className={`w-3 h-3 rounded-[2px] transition-all duration-300 ${completed
                                            ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]'
                                            : 'bg-slate-800/50'
                                        }`}
                                    title={date.toLocaleDateString()}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <TooltipProvider>
            <ScrollArea className="w-full rounded-md border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex gap-1">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {week.map((date, dayIndex) => {
                                const completed = isCompleted(date);
                                return (
                                    <Tooltip key={dayIndex}>
                                        <TooltipTrigger>
                                            <div
                                                className={`w-3 h-3 rounded-[2px] transition-colors ${completed
                                                        ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                                                        : 'bg-slate-900/50 border border-slate-800 hover:border-slate-600'
                                                    }`}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs font-mono">
                                                {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                {completed ? ' • Completed' : ''}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </TooltipProvider>
    );
};
