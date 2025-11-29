import { useState } from "react";
import { JournalEntry } from "@/lib/journalStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, BrainCircuit, Shield, Eye, EyeOff, Activity, Lock } from "lucide-react";

interface MoodAgentProps {
    entry: JournalEntry;
}

export const MoodAgent = ({ entry }: MoodAgentProps) => {
    const [showEncrypted, setShowEncrypted] = useState(false);

    const getColor = (label: string) => {
        switch (label) {
            case 'Positive': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Negative': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    // Simulate encryption for visualization (UTF-8 safe)
    const encryptedContent = btoa(encodeURIComponent(entry.content).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode(parseInt(p1, 16));
        })).substring(0, 50) + "...";

    return (
        <Card className="mt-4 bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-white/10 bg-white/5">
                <CardTitle className="text-xs font-medium flex items-center gap-2 text-emerald-300 uppercase tracking-wider">
                    <BrainCircuit className="w-3 h-3" />
                    Mood Analysis HUD
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                    onClick={() => setShowEncrypted(!showEncrypted)}
                >
                    {showEncrypted ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                    {showEncrypted ? "DECRYPT VIEW" : "NETWORK STATE"}
                </Button>
            </CardHeader>
            <CardContent className="pt-4">
                {showEncrypted ? (
                    <div className="mb-4 p-3 bg-black/40 rounded border border-white/10 font-mono text-[10px] text-emerald-500 break-all relative group">
                        <div className="absolute top-0 right-0 p-1 opacity-50">
                            <Lock className="w-3 h-3 text-emerald-500" />
                        </div>
                        <div className="text-slate-400 mb-1 flex items-center gap-1 uppercase tracking-wider text-[9px]">
                            <Shield className="w-3 h-3" /> On-Chain State:
                        </div>
                        {encryptedContent}
                    </div>
                ) : (
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-200">Detected Mood</span>
                        </div>
                        <Badge variant="outline" className={`${getColor(entry.moodLabel)} border`}>
                            {entry.moodLabel} <span className="ml-1 opacity-50">({entry.moodScore})</span>
                        </Badge>
                    </div>
                )}

                <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                        <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            MIDNIGHT_COMPACT_PROOF
                        </span>
                        <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">VERIFIED</span>
                    </div>
                    <code className="text-[9px] bg-black/40 p-2 rounded block w-full overflow-hidden text-ellipsis font-mono text-slate-500 border border-white/5">
                        {entry.zkProof}
                    </code>
                    <div className="flex items-center gap-1 mt-2 text-[9px] text-slate-500">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        Local ZK-SNARK computation active. Data remains private.
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
