import { midnightRuntime, CompactContract } from './midnight';
import { journalStore } from './journalStore';
import { habitStore } from './habitStore';
import { financeStore } from './financeStore';

export interface SoulState {
    level: number;
    xp: number;
    traits: string[];
    aura: 'Neutral' | 'Zen' | 'Energetic' | 'Tired';
    lastUpdate: number;
}

interface PulseStoreState {
    contract: CompactContract | null;
    soul: SoulState | null;
}

let state: PulseStoreState = {
    contract: null,
    soul: null
};

export const pulseStore = {
    init: () => {
        if (!state.contract) {
            state.contract = midnightRuntime.deployPulseContract();
            state.soul = state.contract.ledger.soul;
        }
        return state.soul;
    },

    getSoul: () => {
        if (!state.soul) pulseStore.init();
        return state.soul;
    },

    // Aggregates data from other stores to create "Wellness Stats"
    // In a real app, this would be done inside a ZK Circuit
    calculateWellness: () => {
        const habits = habitStore.getHabits();
        const meditationHabit = habits.find(h => h.name.toLowerCase().includes('meditate'));
        const meditationStreak = meditationHabit ? meditationHabit.streak : 0;

        // Mock sleep data (allow override for demo)
        const sleepOverride = localStorage.getItem('nebula_pulse_sleep_override');
        const sleepHours = sleepOverride ? parseFloat(sleepOverride) : 7.5;

        // Real savings from financeStore
        const transactions = financeStore.getTransactions();
        // Calculate savings as (Income - Expense) or just total assets if we had that.
        // For this demo, we'll assume "Savings" = "Total Balance" or similar.
        // Since we only track expenses in the simple store, let's assume a base income of $2000
        // and subtract total expenses.
        const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
        const savings = 2000 - totalSpent;

        return {
            sleep: sleepHours,
            meditation: meditationStreak,
            savings: savings
        };
    },

    evolve: async () => {
        if (!state.contract) pulseStore.init();

        const wellnessStats = pulseStore.calculateWellness();

        const { newContract, evolution } = await midnightRuntime.evolveSoul(
            state.contract!,
            wellnessStats
        );

        state.contract = newContract;
        state.soul = evolution;

        return evolution;
    },

    // For Demo/Simulation purposes
    setSleep: (hours: number) => {
        // In a real app, this is read-only from device
        // We'll store this override in a temporary variable or localStorage if needed
        localStorage.setItem('nebula_pulse_sleep_override', hours.toString());
    }
};
