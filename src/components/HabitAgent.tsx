import { HabitInsight } from "@/lib/habitStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, Zap, Flame, Lightbulb } from "lucide-react";

interface HabitAgentProps {
    insights: HabitInsight[];
}

export const HabitAgent = ({ insights }: HabitAgentProps) => {
    const getIcon = (type: HabitInsight['type']) => {
        switch (type) {
            case 'Motivation': return <Flame className="h-4 w-4" />;
            case 'Streak': return <Zap className="h-4 w-4" />;
            case 'Suggestion': return <Lightbulb className="h-4 w-4" />;
        }
    };

    return (
        <Card className="bg-slate-50/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-600">
                    <Zap className="w-4 h-4" />
                    Life-Copilot Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {insights.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Start tracking habits to unlock insights.</p>
                ) : (
                    insights.map((insight, index) => (
                        <Alert key={index} className="bg-white border-slate-200">
                            {getIcon(insight.type)}
                            <AlertTitle>{insight.type}</AlertTitle>
                            <AlertDescription>
                                {insight.message}
                            </AlertDescription>
                        </Alert>
                    ))
                )}

                <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Decentralized Privacy</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                        *Habit data is stored locally. Proofs are generated on-device.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
