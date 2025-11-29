import { useState, useEffect } from "react";
import { pulseStore, SoulState } from "@/lib/pulseStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Moon, Shield, Sparkles, Loader2, Crown, HeartPulse } from "lucide-react";
import { toast } from "sonner";

const Pulse = () => {
    const [soul, setSoul] = useState<SoulState | null>(null);
    const [isEvolving, setIsEvolving] = useState(false);

    useEffect(() => {
        setSoul(pulseStore.init());
    }, []);

    const handleEvolve = async () => {
        setIsEvolving(true);
        try {
            const newSoul = await pulseStore.evolve();
            setSoul(newSoul);
            toast.success("Soul Evolved! New traits unlocked.");
        } catch (error) {
            toast.error("Failed to evolve.");
        } finally {
            setIsEvolving(false);
        }
    };

    if (!soul) return null;

    // Visual styles based on Aura
    const getAuraColor = (aura: string) => {
        switch (aura) {
            case 'Zen': return 'from-blue-500 to-cyan-400';
            case 'Energetic': return 'from-orange-500 to-yellow-400';
            case 'Tired': return 'from-slate-500 to-slate-400';
            default: return 'from-purple-500 to-pink-400';
        }
    };

    const getAuraGlow = (aura: string) => {
        switch (aura) {
            case 'Zen': return 'shadow-blue-500/50';
            case 'Energetic': return 'shadow-orange-500/50';
            case 'Tired': return 'shadow-slate-500/20';
            default: return 'shadow-purple-500/50';
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl min-h-screen text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20">
                        <HeartPulse className="w-8 h-8 text-pink-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
                            Nebula Pulse
                        </h1>
                        <p className="text-slate-400">Proof of Wellness (PoW) • Digital Soul</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs text-pink-300 bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-500/20">
                    <Activity className="w-3 h-3" />
                    <span>Live Bio-Feedback</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* LEFT: AVATAR VISUALIZER */}
                <div className="relative flex justify-center">
                    {/* Aura Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-tr ${getAuraColor(soul.aura)} opacity-20 blur-[100px] rounded-full animate-pulse`} />

                    <div className="relative z-10 text-center">
                        <div className={`w-64 h-64 mx-auto rounded-full bg-gradient-to-br ${getAuraColor(soul.aura)} flex items-center justify-center shadow-2xl ${getAuraGlow(soul.aura)} transition-all duration-1000 p-1`}>
                            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center relative overflow-hidden">
                                {/* Simple CSS Avatar Representation */}
                                <div className={`w-32 h-32 rounded-full bg-gradient-to-t ${getAuraColor(soul.aura)} opacity-80 blur-md absolute bottom-[-20px]`} />
                                <Sparkles className="w-24 h-24 text-white opacity-90 animate-float" />

                                {/* Traits Overlay */}
                                {soul.traits.includes('Mindful Halo') && (
                                    <div className="absolute top-10 w-20 h-1 bg-cyan-400 blur-[2px] rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" />
                                )}
                            </div>
                        </div>

                        <div className="mt-8 space-y-2">
                            <h2 className="text-4xl font-bold text-white tracking-wider">{soul.aura} Soul</h2>
                            <p className="text-slate-400">Level {soul.level} • {soul.xp}/100 XP</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                <Moon className="w-5 h-5 mx-auto mb-1 text-indigo-400" />
                                <div className="text-xs text-slate-400">Sleep</div>
                                <div className="font-bold text-white">7.5h</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                <Zap className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                                <div className="text-xs text-slate-400">Energy</div>
                                <div className="font-bold text-white">High</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                <Shield className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                                <div className="text-xs text-slate-400">Health</div>
                                <div className="font-bold text-white">98%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: EVOLUTION CONTROLS */}
                <div className="space-y-6">
                    <Card className="bg-slate-900/50 border-pink-500/20 backdrop-blur-md">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Crown className="w-5 h-5 text-yellow-400" />
                                Soul Traits
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {soul.traits.map((trait) => (
                                    <Badge key={trait} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white px-3 py-1">
                                        {trait}
                                    </Badge>
                                ))}
                                {soul.traits.length === 0 && <span className="text-slate-500 text-sm">No traits yet. Evolve to unlock.</span>}
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-400">Next Evolution</span>
                                        <span className="text-pink-400 font-mono">{(soul.xp / 100) * 100}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-1000"
                                            style={{ width: `${soul.xp}%` }}
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleEvolve}
                                    disabled={isEvolving}
                                    className="w-full h-14 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-pink-900/20"
                                >
                                    {isEvolving ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Verifying Wellness Proof...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-2" />
                                            Evolve Soul (ZK Sync)
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-center text-slate-500">
                                    Syncs Journal, Finance & Habit data via Zero-Knowledge Proofs.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Milestones */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl border transition-all ${soul.traits.includes('Mindful Halo') ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-slate-900/30 border-slate-800 opacity-50'}`}>
                            <div className="text-sm font-semibold text-cyan-400 mb-1">Mindful Halo</div>
                            <div className="text-xs text-slate-400">Unlock: 5-Day Meditation Streak</div>
                        </div>
                        <div className={`p-4 rounded-xl border transition-all ${soul.traits.includes('Gold Armor') ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-slate-900/30 border-slate-800 opacity-50'}`}>
                            <div className="text-sm font-semibold text-yellow-400 mb-1">Gold Armor</div>
                            <div className="text-xs text-slate-400">Unlock: Save $100+</div>
                        </div>
                    </div>

                    {/* Simulation Controls (For Demo) */}
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                        <div className="text-xs font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
                            <Activity className="w-3 h-3" />
                            Simulation Controls (Demo)
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-8 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                                onClick={() => {
                                    pulseStore.setSleep(5); // < 6h
                                    toast.info("Sleep set to 5h. Click 'Evolve' to see 'Tired Soul'.");
                                }}
                            >
                                Simulate Poor Sleep
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-8 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                                onClick={() => {
                                    pulseStore.setSleep(8); // > 7h
                                    toast.success("Sleep set to 8h. Click 'Evolve' to restore balance.");
                                }}
                            >
                                Simulate Good Sleep
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pulse;
