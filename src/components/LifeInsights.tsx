import { useState } from 'react';
import { BrainCircuit, Sparkles, Loader2, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { journalStore } from '@/lib/journalStore';
import { financeStore } from '@/lib/financeStore';
import { habitStore } from '@/lib/habitStore';
import { toast } from 'sonner';

interface AnalysisResult {
    insights: string[];
    recommendation: string;
}

export const LifeInsights = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            // 1. Gather Data
            const journalData = journalStore.getEntries().slice(0, 5).map(e => ({ mood: e.moodLabel, text: e.content }));
            const financeData = financeStore.getTransactions().slice(0, 5).map(t => ({ amount: t.amount, category: t.category, type: t.type }));
            const habitData = habitStore.getHabits().map(h => ({ name: h.title, streak: h.streak, completed: h.completedDates.length }));

            // 2. Send to Backend
            const response = await fetch('http://localhost:8000/analyze_life', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    journal_entries: journalData,
                    finance_data: financeData,
                    habit_data: habitData
                })
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            // 3. Parse Result
            const parsed = JSON.parse(data.analysis);
            setResult(parsed);
            toast.success("Life Analysis Complete!");

        } catch (error) {
            console.error(error);
            toast.error("Analysis failed. Try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <Card className="border-indigo-500/30 bg-gradient-to-br from-slate-900/90 to-indigo-950/30 backdrop-blur-md overflow-hidden relative">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10" />

            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                        <BrainCircuit className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold text-white">Deep Mind Analytics</CardTitle>
                        <p className="text-xs text-indigo-300/70">Cross-Agent Correlation Engine</p>
                    </div>
                </div>
                <Button
                    size="sm"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                >
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    {isAnalyzing ? 'Analyzing...' : 'Generate Report'}
                </Button>
            </CardHeader>

            <CardContent className="space-y-4">
                {result ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Insights */}
                        <div className="space-y-2">
                            {result.insights.map((insight, i) => (
                                <div key={i} className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                    <p className="text-sm text-slate-200 leading-relaxed">{insight}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recommendation */}
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mt-4">
                            <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold text-sm">
                                <Lightbulb className="w-4 h-4" />
                                Actionable Recommendation
                            </div>
                            <p className="text-sm text-emerald-100/90 italic">"{result.recommendation}"</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-700 rounded-xl bg-slate-950/30">
                        <BrainCircuit className="w-12 h-12 text-slate-700 mb-3" />
                        <p className="text-sm text-slate-400 font-medium">No Analysis Generated</p>
                        <p className="text-xs text-slate-600 max-w-[250px] mt-1">
                            Click "Generate Report" to let Gemini find hidden patterns in your life data.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
