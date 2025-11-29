import { useState, useEffect } from "react";
import { midnightRuntime, CompactContract } from "@/lib/midnight";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Send, RefreshCw, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const MidnightHelloWorld = () => {
    const [contract, setContract] = useState<CompactContract | null>(null);
    const [message, setMessage] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showEncrypted, setShowEncrypted] = useState(false);

    useEffect(() => {
        // Deploy contract on mount
        const deployedContract = midnightRuntime.deployHelloWorld();
        setContract(deployedContract);
        setMessage(deployedContract.ledger.message);
    }, []);

    const handleUpdateMessage = async () => {
        if (!contract || !newMessage.trim()) return;

        setLoading(true);
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const { newContract } = await midnightRuntime.updateHelloWorldMessage(contract, newMessage);
            setContract(newContract);
            setMessage(newContract.ledger.message);
            setNewMessage("");
            toast.success("Message updated on Midnight Network (Simulated)");
        } catch (error) {
            toast.error("Failed to update message");
        } finally {
            setLoading(false);
        }
    };

    // Simulate encryption
    const encryptedMessage = message ? btoa(message) : "";

    return (
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-lg shadow-primary/5">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-primary text-base">
                        <Shield className="w-4 h-4" />
                        Midnight Hello World
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-emerald-500 font-mono">Devnet</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-500 hover:text-primary hover:bg-primary/10"
                            onClick={() => setShowEncrypted(!showEncrypted)}
                            title={showEncrypted ? "Show Decrypted" : "View Network State"}
                        >
                            {showEncrypted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </Button>
                    </div>
                </div>
                <CardDescription className="text-slate-400 text-xs flex items-center justify-between">
                    <span>Simulated Compact smart contract interaction.</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-3 rounded-md bg-slate-950 border border-slate-800/60 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] border border-slate-700 text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded-full">
                            {showEncrypted ? "Encrypted" : "Private"}
                        </span>
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5 font-semibold">
                        {showEncrypted ? "On-Chain Data" : "Current State"}
                    </p>
                    {showEncrypted ? (
                        <p className="font-mono text-xs text-emerald-500/80 break-all leading-relaxed selection:bg-emerald-500/20">
                            {encryptedMessage || <span className="text-slate-700 italic">Empty state</span>}
                        </p>
                    ) : (
                        <p className="font-mono text-sm text-emerald-400 font-medium tracking-tight">
                            {message || <span className="text-slate-600 italic">No message set</span>}
                        </p>
                    )}
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="Update private state..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-600 text-sm h-9 focus-visible:ring-primary/30"
                    />
                    <Button
                        onClick={handleUpdateMessage}
                        disabled={loading || !newMessage.trim()}
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                    >
                        {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    </Button>
                </div>

                {contract && (
                    <div className="space-y-1 pt-2 border-t border-slate-800/50">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-600">Contract ID</span>
                            <code className="text-[10px] text-slate-500 font-mono bg-slate-800/30 px-1.5 py-0.5 rounded">
                                {contract.id}
                            </code>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-600">Proof Server</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                                proof-server.devnet
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
