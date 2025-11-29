import { FinanceInsight } from "@/lib/financeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, TrendingUp, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface FinanceAgentProps {
    insights: FinanceInsight[];
}

export const FinanceAgent = ({ insights }: FinanceAgentProps) => {
    const getIcon = (type: FinanceInsight['type']) => {
        switch (type) {
            case 'Warning': return <AlertTriangle className="h-4 w-4" />;
            case 'Success': return <CheckCircle className="h-4 w-4" />;
            case 'Info': return <Info className="h-4 w-4" />;
        }
    };

    const getVariant = (type: FinanceInsight['type']) => {
        switch (type) {
            case 'Warning': return "destructive";
            case 'Success': return "default"; // Using default for success as there isn't a 'success' variant in standard shadcn alert
            default: return "default";
        }
    };

    return (
        <Card className="bg-slate-50/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-600">
                    <TrendingUp className="w-4 h-4" />
                    Finance Agent Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {insights.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Add transactions to generate insights.</p>
                ) : (
                    insights.map((insight, index) => (
                        <Alert key={index} variant={getVariant(insight.type)} className={insight.type === 'Success' ? 'border-green-500 text-green-700 [&>svg]:text-green-700' : ''}>
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
                        <span>Zero-Knowledge Privacy Active</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                        *Financial data is encrypted and analyzed locally. No bank details are shared.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
