import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, TrendingUp, Activity, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

interface AgentSummaryProps {
    type: 'Journal' | 'Finance' | 'Habits';
    title: string;
    insight: string;
    status: 'Positive' | 'Negative' | 'Neutral' | 'Warning' | 'Success' | 'Info';
    link: string;
}

export const AgentSummary = ({ type, title, insight, status, link }: AgentSummaryProps) => {
    const getIcon = () => {
        switch (type) {
            case 'Journal': return <BrainCircuit className="w-5 h-5 text-purple-400" />;
            case 'Finance': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
            case 'Habits': return <Activity className="w-5 h-5 text-orange-400" />;
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'Positive':
            case 'Success': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Negative':
            case 'Warning': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'Journal': return 'hover:border-purple-500/50';
            case 'Finance': return 'hover:border-emerald-500/50';
            case 'Habits': return 'hover:border-orange-500/50';
        }
    };

    return (
        <Link to={link} className="block group">
            <Card className={`bg-slate-900/40 backdrop-blur-md border-slate-800 transition-all duration-300 ${getBorderColor()} hover:shadow-lg hover:shadow-slate-900/20`}>
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base font-medium flex items-center gap-3 text-slate-200">
                        <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 group-hover:scale-105 transition-transform">
                            {getIcon()}
                        </div>
                        {title}
                    </CardTitle>
                    <Badge variant="outline" className={`${getStatusColor()} border`}>{status}</Badge>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-400 mb-4 min-h-[40px] line-clamp-2 leading-relaxed">
                        {insight}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Masumi Verified</span>
                        </div>
                        <span className="text-xs text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                            View <ArrowRight className="w-3 h-3 ml-1" />
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};
