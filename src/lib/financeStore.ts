import { masumiSDK, MasumiAgentRegistration } from './masumi';

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    category: 'Food' | 'Transport' | 'Utilities' | 'Entertainment' | 'Shopping' | 'Other';
    timestamp: number;
    zkProof: string; // Simulated ZK proof (hash)
}

export interface FinanceInsight {
    type: 'Warning' | 'Success' | 'Info';
    message: string;
    masumiTxId?: string; // Masumi Payment Transaction ID
}

const STORAGE_KEY = 'zk_finance_transactions';

// Register the Finance Agent on Masumi
const financeAgentConfig = {
    name: "Nebula Finance Agent",
    description: "Budgeting and spending analysis",
    fee: 0.2, // 0.2 ADA per insight generation
    version: "1.0.0"
};

export const financeAgentIdentity: MasumiAgentRegistration = masumiSDK.registerAgent(financeAgentConfig);

// Simple hash function to simulate ZK proof generation
const generateZKProof = (amount: number, category: string): string => {
    const data = `${amount}-${category}-${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return `zk-finance-proof-${Math.abs(hash).toString(16)}`;
};

export const financeStore = {
    getTransactions: (): Transaction[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    addTransaction: (description: string, amount: number, category: Transaction['category']): Transaction => {
        const transaction: Transaction = {
            id: crypto.randomUUID(),
            description,
            amount,
            category,
            timestamp: Date.now(),
            zkProof: generateZKProof(amount, category),
        };

        const transactions = financeStore.getTransactions();
        const newTransactions = [transaction, ...transactions];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTransactions));
        return transaction;
    },

    deleteTransaction: (id: string) => {
        const transactions = financeStore.getTransactions().filter(t => t.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    },

    // Now async because it pays a fee via Masumi
    getInsights: async (): Promise<FinanceInsight[]> => {
        const transactions = financeStore.getTransactions();

        // Execute analysis via Masumi Network (simulated)
        const analysisResult = await masumiSDK.executeTask(
            financeAgentIdentity.did,
            financeAgentIdentity.config.fee,
            () => {
                const insights: FinanceInsight[] = [];
                const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
                const categoryTotals: Record<string, number> = {};

                transactions.forEach(t => {
                    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
                });

                if (totalSpent > 1000) {
                    insights.push({
                        type: 'Warning',
                        message: `High spending detected: $${totalSpent.toFixed(2)}. Consider reviewing your budget.`
                    });
                } else {
                    insights.push({
                        type: 'Success',
                        message: `Spending is within a healthy range: $${totalSpent.toFixed(2)}.`
                    });
                }

                Object.entries(categoryTotals).forEach(([category, amount]) => {
                    if (amount > 500) {
                        insights.push({
                            type: 'Info',
                            message: `You've spent $${amount.toFixed(2)} on ${category}.`
                        });
                    }
                });

                return insights;
            }
        );

        const insights = analysisResult.result.map(insight => ({
            ...insight,
            masumiTxId: analysisResult.txHash
        }));

        return insights;
    }
};
