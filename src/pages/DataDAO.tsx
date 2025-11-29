import { useState, useEffect } from "react";
import { daoStore, Bounty } from "@/lib/daoStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Coins, Shield, CheckCircle2, Loader2, Microscope, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

const DataDAO = () => {
    const [balance, setBalance] = useState(0);
    const [bounties, setBounties] = useState<Bounty[]>([]);
    const [contributions, setContributions] = useState<string[]>([]);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        const state = daoStore.init();
        setBalance(state.balance);
        setContributions(state.contributions);
        setBounties(daoStore.getBounties());
    };

    const handleContribute = async (bountyId: string) => {
        setProcessingId(bountyId);
        try {
            const reward = await daoStore.contribute(bountyId);
            toast.success(`Contribution Verified! Received ${reward} RSC`);
            refreshData();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl min-h-screen text-slate-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <Database className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                            Nebula Data DAO
                        </h1>
                        <p className="text-slate-400">Decentralized Science (DeSci) Research Hub</p>
                    </div>
                </div>

                {/* Wallet Card */}
                <Card className="bg-slate-900/80 border-blue-500/30 backdrop-blur-md min-w-[250px]">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Your Earnings</p>
                            <div className="text-2xl font-bold text-white flex items-center gap-2">
                                {balance} <span className="text-sm font-normal text-blue-400">RSC</span>
                            </div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Coins className="w-5 h-5 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Intro Banner */}
            <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/10 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        Monetize Your Data, Privately.
                    </h2>
                    <p className="text-slate-300 max-w-2xl">
                        Contribute your anonymous wellness insights to global research studies.
                        Zero-Knowledge Proofs ensure your raw data never leaves your device—only the mathematical proof that you meet the criteria.
                    </p>
                </div>
                <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-0" />
            </div>

            {/* Bounty Board */}
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Microscope className="w-5 h-5 text-blue-400" />
                Active Research Bounties
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bounties.map((bounty) => {
                    const isCompleted = contributions.includes(bounty.id);
                    return (
                        <Card key={bounty.id} className={`border-slate-800 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-blue-500/30 ${isCompleted ? 'opacity-75' : ''}`}>
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/20">
                                        {bounty.reward} RSC
                                    </Badge>
                                    <Badge variant="secondary" className="bg-slate-800 text-slate-400">
                                        {bounty.participants} Contributors
                                    </Badge>
                                </div>
                                <CardTitle className="text-white text-lg">{bounty.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-3 rounded-lg bg-black/20 border border-white/5 mb-4">
                                    <p className="text-xs text-slate-500 uppercase mb-1">Eligibility Criteria</p>
                                    <p className="text-sm text-emerald-400 font-mono">{bounty.criteria}</p>
                                </div>
                                <p className="text-sm text-slate-400">
                                    Requires generating a ZK Proof from your local data store.
                                </p>
                            </CardContent>
                            <CardFooter>
                                {isCompleted ? (
                                    <Button disabled className="w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Contributed
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleContribute(bounty.id)}
                                        disabled={!!processingId}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {processingId === bounty.id ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Generating Proof...
                                            </>
                                        ) : (
                                            <>
                                                <ArrowUpRight className="w-4 h-4 mr-2" />
                                                Contribute Data
                                            </>
                                        )}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default DataDAO;
