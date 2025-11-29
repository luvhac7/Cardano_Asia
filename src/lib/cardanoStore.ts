// import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

export interface CardanoTransaction {
    id: string;
    type: 'Fee' | 'Deposit' | 'Reward' | 'Transfer';
    amount: number;
    description: string;
    timestamp: number;
    hash: string;
}

const STORAGE_KEY = 'zk_cardano_wallet';
const BLOCKFROST_PROJECT_ID = 'preprodo8dwh7s6ef5mMNwR2WBKoIv6Ew6oBduc';
// User provided Preprod Address
export const DEFAULT_ADDRESS = 'addr_test1qq788atahuzg3ksln75l92er3rkswjf3cmlpjxf2vg60u0pcwu58p4fzyd386rr38l30dhwf94k9x0mdy78r8hj49fwskv6mme';

const BLOCKFROST_API_URL = 'https://cardano-preprod.blockfrost.io/api/v0';

// Helper for Blockfrost fetch
const fetchBlockfrost = async (endpoint: string) => {
    const response = await fetch(`${BLOCKFROST_API_URL}${endpoint}`, {
        headers: {
            'project_id': BLOCKFROST_PROJECT_ID
        }
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || `Blockfrost API Error: ${response.statusText}`);
    }
    return response.json();
};

export const cardanoStore = {
    getState: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : { balance: 0, transactions: [], address: '' };
    },

    saveState: (balance: number, transactions: CardanoTransaction[], address: string) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ balance, transactions, address }));
    },

    // Fetch real balance from Blockfrost
    fetchBalance: async (address: string): Promise<number> => {
        try {
            const result = await fetchBlockfrost(`/addresses/${address}`);
            const lovelace = result.amount.find((a: any) => a.unit === 'lovelace')?.quantity || '0';
            const ada = parseInt(lovelace) / 1000000;

            // Update local state
            const state = cardanoStore.getState();
            cardanoStore.saveState(ada, state.transactions, address);

            return ada;
        } catch (error: any) {
            console.error("Failed to fetch balance:", error);
            throw error;
        }
    },

    // Fetch real transactions from Blockfrost
    fetchTransactions: async (address: string): Promise<CardanoTransaction[]> => {
        try {
            const result = await fetchBlockfrost(`/addresses/${address}/transactions?order=desc&count=10`);

            const transactions: CardanoTransaction[] = result.map((tx: any) => ({
                id: tx.tx_hash,
                type: tx.tx_index === 0 ? 'Deposit' : 'Transfer', // Simplified logic
                amount: 0, // Blockfrost tx endpoint needed for exact amount, simplified for list
                description: `Tx: ${tx.tx_hash.substring(0, 8)}...`,
                timestamp: tx.block_time * 1000,
                hash: tx.tx_hash
            }));

            // Update local state
            const state = cardanoStore.getState();
            cardanoStore.saveState(state.balance, transactions, address);

            return transactions;
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
            return [];
        }
    },

    // Simulated Fee Payment (since we can't sign txs without wallet connector yet)
    payFee: (amount: number, description: string) => {
        const state = cardanoStore.getState();
        // Allow fee payment even if balance is 0 for demo purposes, or enforce check
        // if (state.balance < amount) throw new Error("Insufficient funds");

        const tx: CardanoTransaction = {
            id: crypto.randomUUID(),
            type: 'Fee',
            amount: -amount,
            description,
            timestamp: Date.now(),
            hash: `sim-tx-${Math.random().toString(36).substring(7)}`
        };

        const newTransactions = [tx, ...state.transactions];
        // Don't actually deduct from real balance as we can't write to chain
        cardanoStore.saveState(state.balance, newTransactions, state.address);
        return tx;
    },

    deposit: (amount: number) => {
        // Deprecated in real mode, but kept for compatibility
        const state = cardanoStore.getState();
        const tx: CardanoTransaction = {
            id: crypto.randomUUID(),
            type: 'Deposit',
            amount: amount,
            description: 'Simulated Top-up',
            timestamp: Date.now(),
            hash: `sim-tx-${Math.random().toString(36).substring(7)}`
        };
        const newTransactions = [tx, ...state.transactions];
        cardanoStore.saveState(state.balance + amount, newTransactions, state.address);
        return tx;
    }
};
