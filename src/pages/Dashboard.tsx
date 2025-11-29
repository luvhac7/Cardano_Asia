import { useState, useEffect } from "react";
import { cardanoStore, CardanoTransaction } from "@/lib/cardanoStore";
import { journalStore } from "@/lib/journalStore";
import { financeStore } from "@/lib/financeStore";
import { habitStore } from "@/lib/habitStore";
import { CardanoWallet } from "@/components/CardanoWallet";
import { AgentSummary } from "@/components/AgentSummary";
import { MidnightHelloWorld } from "@/components/MidnightHelloWorld";
import { MoodMemeWidget } from "@/components/MoodMemeWidget";
import { LifeInsights } from "@/components/LifeInsights";
import { Button } from "@/components/ui/button";
import { RefreshCw, Zap, Activity, Shield, Terminal, Cpu } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<CardanoTransaction[]>([]);
    const [journalInsight, setJournalInsight] = useState<{ text: string, status: any }>({ text: "No recent entries", status: "Neutral" });
    const [financeInsight, setFinanceInsight] = useState<{ text: string, status: any }>({ text: "No recent transactions", status: "Info" });
    const [habitInsight, setHabitInsight] = useState<{ text: string, status: any }>({ text: "Start tracking habits", status: "Neutral" });
    const [systemLogs, setSystemLogs] = useState<{ time: string, msg: string, type: 'info' | 'success' | 'warning' }[]>([
        { time: '10:42:01', msg: 'System initialized', type: 'info' },
        { time: '10:42:05', msg: 'Masumi Network connected', type: 'success' },
    ]);

    useEffect(() => {
        refreshData();
    }, []);

    const addLog = (msg: string, type: 'info' | 'success' | 'warning' = 'info') => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        setSystemLogs(prev => [{ time, msg, type }, ...prev].slice(0, 50));
    };

    const refreshData = async () => {
        const walletState = cardanoStore.getState();
        setBalance(walletState.balance);
        setTransactions(walletState.transactions);

        // Get latest insights
        const journalEntries = journalStore.getEntries();
        if (journalEntries.length > 0) {
            const latest = journalEntries[0];
            setJournalInsight({
                text: `Latest mood: ${latest.moodLabel}. "${latest.content.substring(0, 30)}..."`,
                status: latest.moodLabel
            });
        }

        const financeInsights = await financeStore.getInsights();
        if (financeInsights.length > 0) {
            const latest = financeInsights[0];
            setFinanceInsight({
                text: latest.message,
                status: latest.type
            });
        }

        const habitInsights = habitStore.getInsights();
        if (habitInsights.length > 0) {
            const latest = habitInsights[0];
            setHabitInsight({
                text: latest.message,
                status: latest.type === 'Motivation' ? 'Success' : 'Info'
            });
        }

        addLog('Data synchronization complete', 'success');
    };

    const handleDeposit = () => {
        cardanoStore.deposit(50);
        refreshData();
        toast.success("Wallet topped up with 50 ₳");
        addLog('Deposit received: 50 ADA', 'success');
    };

    const handleRefreshInsights = () => {
        try {
            // Simulate paying a micro-fee for AI processing
            cardanoStore.payFee(0.5, "AI Insight Generation Fee");
            refreshData();
            toast.success("AI Insights refreshed. Fee: 0.5 ₳");
            addLog('AI Insights refreshed (Fee: 0.5 ADA)', 'info');
        } catch (error) {
            toast.error("Insufficient funds to refresh insights.");
            addLog('Failed to refresh insights: Insufficient funds', 'warning');
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-7xl min-h-screen text-slate-200">
            {/* Command Center Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                            <Cpu className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Nebula Command Center
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 ml-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        System Online
                        <span className="text-slate-700">•</span>
                        <span>v2.4.0-beta</span>
                    </div>
                </div>
                <Button onClick={handleRefreshInsights} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 border border-indigo-500/20">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh AI Insights (0.5 ₳)
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_350px] xl:grid-cols-[1fr_400px]">
                {/* Main Feed Area */}
                <div className="space-y-6">
                    {/* Intelligence Grid */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <AgentSummary
                            type="Journal"
                            title="Wellness Journal"
                            insight={journalInsight.text}
                            status={journalInsight.status}
                            link="/journal"
                        />
                        <AgentSummary
                            type="Finance"
                            title="Financial Advisor"
                            insight={financeInsight.text}
                            status={financeInsight.status}
                            link="/finance"
                        />
                        <AgentSummary
                            type="Habits"
                            title="Life-Copilot"
                            insight={habitInsight.text}
                            status={habitInsight.status}
                            link="/habits"
                        />
                    </div>

                    {/* Widgets Grid */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-6">
                            <CardanoWallet
                                balance={balance}
                                transactions={transactions}
                                onDeposit={handleDeposit}
                                onRefresh={refreshData}
                            />
                            <MoodMemeWidget />
                            <LifeInsights />
                        </div>

                        <div className="space-y-6">
                            <MidnightHelloWorld />

                            {/* System Log */}
                            <div className="rounded-xl border border-slate-800 bg-black/40 backdrop-blur-sm overflow-hidden">
                                <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-mono text-slate-400">SYSTEM_LOG</span>
                                </div>
                                <ScrollArea className="h-[200px] p-4 font-mono text-xs">
                                    <div className="space-y-2">
                                        {systemLogs.map((log, i) => (
                                            <div key={i} className="flex gap-3">
                                                <span className="text-slate-600 shrink-0">{log.time}</span>
                                                <span className={
                                                    log.type === 'success' ? 'text-emerald-400' :
                                                        log.type === 'warning' ? 'text-amber-400' :
                                                            'text-slate-300'
                                                }>
                                                    {log.type === 'success' && '✓ '}
                                                    {log.type === 'warning' && '⚠ '}
                                                    {log.msg}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Network Status */}
                    <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
                        <h3 className="font-semibold flex items-center gap-2 mb-4 text-slate-200">
                            <Activity className="w-4 h-4 text-indigo-400" />
                            Network Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <span className="text-sm text-slate-300">Masumi Network</span>
                                </div>
                                <span className="text-xs font-mono text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded">CONNECTED</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    <span className="text-sm text-slate-300">Cardano Preprod</span>
                                </div>
                                <span className="text-xs font-mono text-blue-500/80 bg-blue-500/10 px-2 py-0.5 rounded">SYNCED</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                    <span className="text-sm text-slate-300">Midnight Devnet</span>
                                </div>
                                <span className="text-xs font-mono text-purple-500/80 bg-purple-500/10 px-2 py-0.5 rounded">ACTIVE</span>
                            </div>
                        </div>
                    </div>

                    {/* Active Agents */}
                    <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
                        <h3 className="font-semibold flex items-center gap-2 mb-4 text-slate-200">
                            <Shield className="w-4 h-4 text-indigo-400" />
                            Active Agents
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Mood Agent', did: 'did:masumi:mood...', status: 'Active' },
                                { name: 'Finance Agent', did: 'did:masumi:fin...', status: 'Active' },
                                { name: 'Habit Agent', did: 'did:masumi:habit...', status: 'Idle' }
                            ].map((agent, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">{agent.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-slate-600">{agent.did}</span>
                                        <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                            <span className="text-[10px] text-slate-600 uppercase tracking-wider">Powered by Masumi SDK v1.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
