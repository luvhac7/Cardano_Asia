import { useState, useEffect } from "react";
import { financeStore, Transaction, FinanceInsight } from "@/lib/financeStore";
import { cardanoStore, DEFAULT_ADDRESS } from "@/lib/cardanoStore";
import { FinanceAgent } from "@/components/FinanceAgent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Wallet, ArrowUpRight, ArrowDownLeft, Repeat, Layers,
    Settings, Copy, TrendingUp, Plus, Trash2, DollarSign, BrainCircuit
} from "lucide-react";
import { toast } from "sonner";

const Finance = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [insights, setInsights] = useState<FinanceInsight[]>([]);
    const [adaPrice, setAdaPrice] = useState(0.45); // Mock price

    // Advisor State
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState<Transaction['category']>('Other');

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        const walletState = cardanoStore.getState();
        setBalance(walletState.balance);
        setTransactions(financeStore.getTransactions());
        const newInsights = await financeStore.getInsights();
        setInsights(newInsights);
    };

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(DEFAULT_ADDRESS);
        toast.success("Address copied to clipboard");
    };

    const handleAddTransaction = () => {
        if (!description || !amount) return;

        financeStore.addTransaction(description, parseFloat(amount), category);
        refreshData();
        setDescription("");
        setAmount("");
        setCategory('Other');
        toast.success("Expense logged securely!");
    };

    const handleDelete = (id: string) => {
        financeStore.deleteTransaction(id);
        refreshData();
        toast.success("Transaction deleted.");
    };

    const ActionButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
        <div className="flex flex-col items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                className="h-14 w-14 rounded-full border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all"
                onClick={onClick}
            >
                <Icon className="w-6 h-6 text-white" />
            </Button>
            <span className="text-xs text-slate-400 font-medium">{label}</span>
        </div>
    );

    const AssetRow = ({ icon, name, ticker, amount, value, change }: any) => (
        <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-white/10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg">
                    {icon}
                </div>
                <div>
                    <h4 className="font-semibold text-white">{name}</h4>
                    <span className="text-xs text-slate-500">{ticker}</span>
                </div>
            </div>
            <div className="text-right">
                <div className="font-medium text-white">${value}</div>
                <div className={`text-xs ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {change >= 0 ? '+' : ''}{change}%
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-6 max-w-md min-h-screen text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        <Wallet className="w-5 h-5 text-emerald-500" />
                    </div>
                    <span className="font-semibold text-white">My Finance</span>
                </div>
                <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                    <Settings className="w-5 h-5" />
                </Button>
            </div>

            <Tabs defaultValue="wallet" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-6">
                    <TabsTrigger value="wallet" className="data-[state=active]:bg-emerald-600">Wallet</TabsTrigger>
                    <TabsTrigger value="advisor" className="data-[state=active]:bg-emerald-600">AI Advisor</TabsTrigger>
                </TabsList>

                <TabsContent value="wallet" className="space-y-6">
                    {/* Main Wallet Card */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 p-6 shadow-2xl shadow-emerald-900/20">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Layers className="w-32 h-32" />
                        </div>

                        <div className="relative z-10">
                            <span className="text-emerald-100 text-sm font-medium">Total Balance</span>
                            <div className="flex items-baseline gap-2 mt-1 mb-6">
                                <h2 className="text-4xl font-bold text-white">
                                    ${(balance * adaPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h2>
                                <span className="text-emerald-100">USD</span>
                            </div>

                            <div className="flex items-center justify-between bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <span className="text-xs font-bold text-emerald-200">₳</span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{balance.toFixed(2)} ADA</div>
                                        <div className="text-[10px] text-emerald-100 flex items-center gap-1">
                                            {DEFAULT_ADDRESS.substring(0, 8)}...{DEFAULT_ADDRESS.substring(DEFAULT_ADDRESS.length - 4)}
                                            <Copy
                                                className="w-3 h-3 cursor-pointer hover:text-white"
                                                onClick={handleCopyAddress}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-4 gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="flex flex-col items-center gap-2 cursor-pointer">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-14 w-14 rounded-full border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all"
                                    >
                                        <ArrowUpRight className="w-6 h-6 text-white" />
                                    </Button>
                                    <span className="text-xs text-slate-400 font-medium">Send</span>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-emerald-500/20 text-white">
                                <DialogHeader>
                                    <DialogTitle>Send ADA</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                        Securely transfer assets with ZK Proof of Solvency.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Recipient Address</label>
                                        <Input
                                            placeholder="addr_test1..."
                                            className="bg-black/20 border-white/10 focus:border-emerald-500/50"
                                            id="recipient-address"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Amount (ADA)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-slate-500">₳</span>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                className="pl-8 bg-black/20 border-white/10 focus:border-emerald-500/50"
                                                id="send-amount"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => {
                                            const recipient = (document.getElementById('recipient-address') as HTMLInputElement).value;
                                            const amount = parseFloat((document.getElementById('send-amount') as HTMLInputElement).value);

                                            if (!recipient || !amount) {
                                                toast.error("Please fill in all fields");
                                                return;
                                            }

                                            try {
                                                cardanoStore.sendTransaction(recipient, amount);
                                                toast.success("Transaction Sent! ZK Proof Verified.");
                                                refreshData();
                                                // Close dialog logic would go here, but for now we rely on user clicking outside or we'd need controlled state
                                            } catch (e: any) {
                                                toast.error(e.message);
                                            }
                                        }}
                                    >
                                        Confirm Transfer
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Receive Modal */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="flex flex-col items-center gap-2 cursor-pointer">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-14 w-14 rounded-full border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all"
                                    >
                                        <ArrowDownLeft className="w-6 h-6 text-white" />
                                    </Button>
                                    <span className="text-xs text-slate-400 font-medium">Receive</span>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-emerald-500/20 text-white">
                                <DialogHeader>
                                    <DialogTitle>Receive Assets</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                        Scan QR or copy address to deposit funds.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col items-center py-6 space-y-4">
                                    <div className="w-48 h-48 bg-white p-2 rounded-xl">
                                        {/* Placeholder QR Code */}
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${DEFAULT_ADDRESS}`}
                                            alt="Wallet QR"
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <div className="w-full bg-black/30 p-3 rounded-lg flex items-center justify-between border border-white/10">
                                        <span className="text-xs text-slate-400 font-mono truncate mr-2">
                                            {DEFAULT_ADDRESS}
                                        </span>
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleCopyAddress}>
                                            <Copy className="w-4 h-4 text-emerald-500" />
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Swap Modal */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="flex flex-col items-center gap-2 cursor-pointer">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-14 w-14 rounded-full border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all"
                                    >
                                        <Repeat className="w-6 h-6 text-white" />
                                    </Button>
                                    <span className="text-xs text-slate-400 font-medium">Swap</span>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-emerald-500/20 text-white">
                                <DialogHeader>
                                    <DialogTitle>Swap Tokens</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                        Instant DEX aggregation with privacy protection.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">From</label>
                                        <div className="flex gap-2">
                                            <Input value="ADA" disabled className="w-24 bg-black/20 border-white/10" />
                                            <Input
                                                type="number"
                                                placeholder="Amount"
                                                className="bg-black/20 border-white/10 focus:border-emerald-500/50"
                                                id="swap-amount"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <Repeat className="w-6 h-6 text-emerald-500 animate-pulse" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">To</label>
                                        <Select defaultValue="SNEK">
                                            <SelectTrigger className="bg-black/20 border-white/10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SNEK">SNEK (Meme)</SelectItem>
                                                <SelectItem value="MIN">MIN (MinSwap)</SelectItem>
                                                <SelectItem value="HOSKY">HOSKY (Doggo)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => {
                                            const amount = parseFloat((document.getElementById('swap-amount') as HTMLInputElement).value);
                                            if (!amount) return toast.error("Enter amount");

                                            try {
                                                cardanoStore.swapTransaction("ADA", "SNEK", amount);
                                                toast.success("Swap Executed! (Simulated)");
                                                refreshData();
                                            } catch (e: any) {
                                                toast.error(e.message);
                                            }
                                        }}
                                    >
                                        Swap Now
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Stake Modal */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="flex flex-col items-center gap-2 cursor-pointer">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-14 w-14 rounded-full border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all"
                                    >
                                        <Layers className="w-6 h-6 text-white" />
                                    </Button>
                                    <span className="text-xs text-slate-400 font-medium">Stake</span>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-emerald-500/20 text-white">
                                <DialogHeader>
                                    <DialogTitle>Staking Center</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                        Delegate to a pool to earn rewards (~3-4% APY).
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-emerald-400">NEBULA Pool</span>
                                            <span className="text-xs bg-emerald-500/20 px-2 py-1 rounded text-emerald-300">Recommended</span>
                                        </div>
                                        <div className="text-sm text-slate-300">
                                            Support the Nebula ecosystem and earn enhanced rewards.
                                        </div>
                                        <div className="mt-3 flex gap-4 text-xs text-slate-400">
                                            <span>ROA: <b>4.2%</b></span>
                                            <span>Saturation: <b>12%</b></span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Custom Pool ID (Optional)</label>
                                        <Input
                                            placeholder="pool1..."
                                            className="bg-black/20 border-white/10 focus:border-emerald-500/50"
                                            id="stake-pool-id"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => {
                                            const poolId = (document.getElementById('stake-pool-id') as HTMLInputElement).value || "NEBULA Pool";
                                            try {
                                                cardanoStore.stakeTransaction(poolId);
                                                toast.success(`Delegated to ${poolId}!`);
                                                refreshData();
                                            } catch (e: any) {
                                                toast.error(e.message);
                                            }
                                        }}
                                    >
                                        Delegate Stake (2 ADA Deposit)
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Assets */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">Assets</h3>
                            <Button variant="ghost" size="sm" className="text-xs text-emerald-400 hover:text-emerald-300">See All</Button>
                        </div>
                        <AssetRow icon="₳" name="Cardano" ticker="ADA" amount={balance} value={(balance * adaPrice).toFixed(2)} change={2.4} />
                        <AssetRow icon="🐍" name="Snek" ticker="SNEK" amount="420,000" value="850.00" change={-5.2} />
                        <AssetRow icon="🐱" name="MinSwap" ticker="MIN" amount="1,500" value="45.00" change={1.8} />
                    </div>
                </TabsContent>

                <TabsContent value="advisor" className="space-y-6">
                    {/* AI Insight Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-500/20 p-1">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <BrainCircuit className="w-32 h-32 text-emerald-500" />
                        </div>
                        <FinanceAgent insights={insights} />
                    </div>

                    {/* Quick Add Expense */}
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Log Expense
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Coffee..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="bg-black/20 border-white/10 focus:border-emerald-500/50"
                                />
                                <div className="relative w-24">
                                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        className="pl-7 bg-black/20 border-white/10 focus:border-emerald-500/50"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                                    <SelectTrigger className="bg-black/20 border-white/10 focus:border-emerald-500/50">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Food">Food</SelectItem>
                                        <SelectItem value="Transport">Transport</SelectItem>
                                        <SelectItem value="Utilities">Utilities</SelectItem>
                                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                                        <SelectItem value="Shopping">Shopping</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleAddTransaction} className="w-full bg-emerald-600 hover:bg-emerald-700">
                                    Log
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Expenses List */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-slate-400">Recent Expenses</h3>
                        {transactions.length === 0 ? (
                            <div className="text-center py-8 text-slate-600 border border-dashed border-slate-800 rounded-xl">
                                No expenses logged yet.
                            </div>
                        ) : (
                            transactions.map((t) => (
                                <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/10 rounded-full">
                                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{t.description}</div>
                                            <div className="text-xs text-slate-500">{t.category} • {new Date(t.timestamp).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-white">-${t.amount.toFixed(2)}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDelete(t.id)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Finance;
