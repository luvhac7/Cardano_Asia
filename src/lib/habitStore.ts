export interface Habit {
    id: string;
    title: string;
    streak: number;
    lastCompleted: number | null; // Timestamp
    history: number[]; // Array of completion timestamps
    zkProof: string; // Simulated ZK proof
}

export interface HabitInsight {
    type: 'Motivation' | 'Streak' | 'Suggestion';
    message: string;
}

const STORAGE_KEY = 'zk_life_copilot_habits';

// Simple hash function to simulate ZK proof generation
const generateZKProof = (habitId: string, streak: number): string => {
    const data = `${habitId}-${streak}-${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return `zk-habit-proof-${Math.abs(hash).toString(16)}`;
};

export const habitStore = {
    getHabits: (): Habit[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        try {
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Failed to parse habits from local storage:", error);
            return [];
        }
    },

    addHabit: (title: string): Habit => {
        const habit: Habit = {
            id: crypto.randomUUID(),
            title,
            streak: 0,
            lastCompleted: null,
            history: [],
            zkProof: 'pending-init',
        };

        const habits = habitStore.getHabits();
        const newHabits = [habit, ...habits];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHabits));
        return habit;
    },

    generateAIHabits: () => {
        const essentialHabits = [
            "Deep Work (2h)",
            "Hydration (2L)",
            "Meditation (15m)",
            "Sleep (8h)",
            "Read (30m)"
        ];

        const currentHabits = habitStore.getHabits();
        const currentTitles = new Set(currentHabits.map(h => h.title.toLowerCase()));

        let addedCount = 0;
        essentialHabits.forEach(title => {
            if (!currentTitles.has(title.toLowerCase())) {
                habitStore.addHabit(title);
                addedCount++;
            }
        });
        return addedCount;
    },

    toggleHabit: (id: string) => {
        const habits = habitStore.getHabits();
        const updatedHabits = habits.map(h => {
            if (h.id === id) {
                const now = Date.now();
                const today = new Date(now).setHours(0, 0, 0, 0);
                const last = h.lastCompleted ? new Date(h.lastCompleted).setHours(0, 0, 0, 0) : 0;

                if (today === last) {
                    // Already completed today, undo? For simplicity, let's just ignore or implement undo later.
                    // For this MVP, we'll just return as is or maybe toggle off if we wanted to support that.
                    // Let's assume toggle ON only for now to keep streak logic simple.
                    return h;
                }

                const isConsecutive = (today - last) === 86400000; // 24 hours in ms
                const newStreak = isConsecutive ? h.streak + 1 : 1;

                return {
                    ...h,
                    streak: newStreak,
                    lastCompleted: now,
                    history: [...h.history, now],
                    zkProof: generateZKProof(h.id, newStreak)
                };
            }
            return h;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHabits));
    },

    deleteHabit: (id: string) => {
        const habits = habitStore.getHabits().filter(h => h.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    },

    getInsights: (): HabitInsight[] => {
        const habits = habitStore.getHabits();
        const insights: HabitInsight[] = [];

        const totalStreaks = habits.reduce((sum, h) => sum + h.streak, 0);
        const activeHabits = habits.filter(h => h.lastCompleted && (Date.now() - h.lastCompleted < 172800000)); // Completed within last 48h

        if (habits.length === 0) {
            insights.push({
                type: 'Suggestion',
                message: "Start small! Add your first habit to begin your journey."
            });
        } else if (activeHabits.length === habits.length && habits.length > 0) {
            insights.push({
                type: 'Motivation',
                message: "You're on fire! All habits are active."
            });
        }

        const longStreak = habits.find(h => h.streak > 5);
        if (longStreak) {
            insights.push({
                type: 'Streak',
                message: `Impressive streak on "${longStreak.title}"! Keep it up.`
            });
        }

        return insights;
    }
};
