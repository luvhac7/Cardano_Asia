import { CardanoTransaction } from "@/lib/cardanoStore";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, Search } from "lucide-react";
import { cardanoStore, DEFAULT_ADDRESS } from "@/lib/cardanoStore";
import { toast } from "sonner";

interface CardanoWalletProps {
    balance: number;
    transactions: CardanoTransaction[];
    onDeposit: () => void;
    onRefresh: () => void; // New prop to trigger dashboard refresh
}

export const CardanoWallet = ({ balance, transactions, onDeposit, onRefresh }: CardanoWalletProps) => {
    const [address, setAddress] = useState(DEFAULT_ADDRESS);
    const [loading, setLoading] = useState(false);

    // Auto-load default address on mount
    useEffect(() => {
        if (DEFAULT_ADDRESS) {
            handleLoadWallet();
        }
    }, []);

    const handleLoadWallet = async () => {
        if (!address) return;
        setLoading(true);
        try {
            await cardanoStore.fetchBalance(address);
            await cardanoStore.fetchTransactions(address);
            onRefresh(); // Refresh parent state
            toast.success("Wallet data loaded from Preprod!");
        } catch (error: any) {
            toast.error(`Failed to load wallet: ${error.message || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-card border-border shadow-lg">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Wallet className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Cardano Wallet (Preprod)</CardTitle>
                            <CardDescription>Real-time blockchain data</CardDescription>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold font-mono tracking-tight">
                            {balance.toFixed(2)} ₳
                        </div>
                        <div className="text-xs text-muted-foreground">Available Balance</div>
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <Input
                        placeholder="Enter Preprod Address (addr_test1...)"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="text-xs font-mono"
                    />
                    <Button onClick={handleLoadWallet} disabled={loading} size="sm">
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Button className="w-full" variant="outline" onClick={onDeposit}>
                            <ArrowDownLeft className="w-4 h-4 mr-2" />
                            Simulate Deposit
                        </Button>
                        <Button className="w-full" variant="outline" disabled>
                            <ArrowUpRight className="w-4 h-4 mr-2" />
                            Send (Read-Only)
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Recent Transactions</h4>
                        <div className="space-y-2">
                            {transactions.length === 0 && (
                                <p className="text-xs text-center text-muted-foreground py-4">No transactions found.</p>
                            )}
                            {transactions.slice(0, 3).map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${tx.amount > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className="font-medium">{tx.type}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={tx.amount > 0 ? 'text-green-500' : 'text-foreground'}>
                                            {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} ₳
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {new Date(tx.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
