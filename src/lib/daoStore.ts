import { midnightRuntime, CompactContract } from './midnight';

export interface Bounty {
    id: string;
    title: string;
    reward: number;
    criteria: string;
    participants: number;
}

export interface DAOState {
    balance: number; // RSC Tokens
    contributions: string[]; // List of bounty IDs contributed to
    contract: CompactContract | null;
}

// Initial State
let state: DAOState = {
    balance: 0,
    contributions: [],
    contract: null
};

export const daoStore = {
    init: () => {
        if (!state.contract) {
            state.contract = midnightRuntime.deployDataMarket();
        }
        return state;
    },

    getState: () => state,

    getBounties: (): Bounty[] => {
        if (!state.contract) daoStore.init();
        return state.contract?.ledger.bounties || [];
    },

    contribute: async (bountyId: string): Promise<number> => {
        if (!state.contract) daoStore.init();

        // Check if already contributed
        if (state.contributions.includes(bountyId)) {
            throw new Error("You have already contributed to this study.");
        }

        // Simulate private user data (in real app, fetch from other stores)
        const mockUserData = { stress: 60, role: 'Dev' };

        const { newContract, reward } = await midnightRuntime.contributeData(
            state.contract!,
            bountyId,
            mockUserData
        );

        // Update State
        state.contract = newContract;
        state.balance += reward;
        state.contributions.push(bountyId);

        return reward;
    }
};
