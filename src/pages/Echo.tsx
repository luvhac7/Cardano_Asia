import { useState, useEffect } from "react";
import { midnightRuntime, CompactContract } from "@/lib/midnight";
import { journalStore } from "@/lib/journalStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ghost, Heart, Shield, Lock, Send, Sparkles, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const Echo = () => {
    const [contract, setContract] = useState<CompactContract | null>(null);
    const [journalEntries, setJournalEntries] = useState<any[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const [isVibing, setIsVibing] = useState<string | null>(null);

    // Initialize Contract & Load Journal
    useEffect(() => {
        const init = async () => {
            const c = midnightRuntime.deployEchoContract();
            setContract(c);

            // Get entries with "Negative" mood for the demo
            const entries = journalStore.getEntries().filter(e =>
                ['Anxious', 'Sad', 'Stressed', 'Angry', 'Negative'].includes(e.moodLabel)
            );
            setJournalEntries(entries);
        };
        init();
    }, []);

    const handlePostGhost = async () => {
        if (!contract || !selectedEntry) return;
        setIsPosting(true);
        try {
            // Simulate Stress Score (random high score for demo)
            const stressScore = 85;

            const { newContract } = await midnightRuntime.postGhostMessage(
                contract,
                "Encrypted Content Placeholder",
                stressScore
            );

            setContract(newContract);
            toast.success("Ghost Message Posted! (ZK Proof Verified)");
            setSelectedEntry(null);
        } catch (error) {
            toast.error("Failed to post message.");
        } finally {
            setIsPosting(false);
        }
    };

    const handleSendVibes = async (msgId: string) => {
        if (!contract) return;
        setIsVibing(msgId);
        try {
            const { newContract } = await midnightRuntime.sendVibes(contract, msgId);
            setContract(newContract);
            toast.success("Good Vibes Sent! (+1 Token)");
        } catch (error) {
            toast.error("Failed to send vibes.");
        } finally {
            setIsVibing(null);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl min-h-screen text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <Ghost className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                            Nebula Echo
                        </h1>
                        <p className="text-slate-400">Anonymous Emotional Support Network (ZK-Powered)</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
                    <Shield className="w-3 h-3" />
                    <span>Midnight Privacy Track</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT: VENTING BOOTH */}
                <div className="space-y-6">
                    <Card className="border-purple-500/20 bg-slate-900/50 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Lock className="w-5 h-5 text-purple-400" />
                                Venting Booth
                            </CardTitle>
                            <CardDescription>
                                Prove your stress level without revealing your diary.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm text-slate-400 mb-2">Select a Journal Entry to Anonymize:</div>
                            <ScrollArea className="h-[300px] pr-4">
                                <div className="space-y-3">
                                    {journalEntries.length > 0 ? journalEntries.map((entry) => (
                                        <div
                                            key={entry.id}
                                            onClick={() => setSelectedEntry(entry.id)}
                                            className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedEntry === entry.id
                                                ? 'bg-purple-500/20 border-purple-500/50'
                                                : 'bg-black/20 border-white/5 hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                                                    {new Date(entry.timestamp).toLocaleDateString()}
                                                </Badge>
                                                <Badge className={`${entry.moodLabel === 'Anxious' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
                                                    }`}>
                                                    {entry.moodLabel}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-300 line-clamp-2 italic">"{entry.content}"</p>
                                        </div>
                                    )) : (
                                        <div className="text-center py-10 text-slate-500">
                                            No "High Stress" entries found in your journal.
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            <Button
                                onClick={handlePostGhost}
                                disabled={!selectedEntry || isPosting}
                                className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
                            >
                                {isPosting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                {isPosting ? 'Generating ZK Proof...' : 'Anonymize & Post Signal'}
                            </Button>
                            <p className="text-[10px] text-center text-slate-500">
                                Generates Proof: "Stress &gt; 80" • Identity Hidden
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT: COMMUNITY FEED */}
                <div className="space-y-6">
                    <Card className="border-emerald-500/20 bg-slate-900/50 backdrop-blur-md h-full">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Ghost className="w-5 h-5 text-emerald-400" />
                                Community Echo
                            </CardTitle>
                            <CardDescription>
                                Anonymous signals from verified humans.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[500px] pr-4">
                                <div className="space-y-4">
                                    {contract?.ledger.messages.length === 0 && (
                                        <div className="text-center py-20 text-slate-600">
                                            <Ghost className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>No signals yet. Be the first to share.</p>
                                        </div>
                                    )}

                                    {contract?.ledger.messages.map((msg: any) => (
                                        <div key={msg.id} className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 animate-in fade-in slide-in-from-bottom-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex gap-2">
                                                    {msg.tags.map((tag: string) => (
                                                        <Badge key={tag} variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-mono">
                                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>

                                            <p className="text-slate-300 mb-4 font-medium">
                                                "{msg.content}"
                                            </p>

                                            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Shield className="w-3 h-3 text-indigo-400" />
                                                    ZK Verified
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleSendVibes(msg.id)}
                                                    disabled={isVibing === msg.id}
                                                    className="hover:bg-pink-500/10 hover:text-pink-400 text-slate-400"
                                                >
                                                    {isVibing === msg.id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Heart className={`w-3 h-3 mr-1 ${msg.vibes > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />}
                                                    Send Vibes ({msg.vibes})
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Echo;
