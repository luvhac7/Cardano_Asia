import Sentiment from 'sentiment';
import { masumiSDK, MasumiAgentRegistration } from './masumi';
import { midnightRuntime, CompactContract, CompactProof } from './midnight';

export interface JournalEntry {
  id: string;
  content: string;
  timestamp: number;
  moodScore: number;
  moodLabel: 'Positive' | 'Negative' | 'Neutral';
  imageUrl?: string; // Base64 string for the image
  zkProof: string; // Simulated ZK proof (hash)
  masumiTxId?: string; // Masumi Payment Transaction ID
  midnightProof?: CompactProof; // Midnight Compact Proof
}

const STORAGE_KEY = 'zk_wellness_journal_entries';
const sentiment = new Sentiment();

// Register the Mood Agent on Masumi
const moodAgentConfig = {
  name: "Nebula Mood Agent",
  description: "Sentiment analysis for wellness journals",
  fee: 0.1, // 0.1 ADA per analysis
  version: "1.0.0"
};

export const moodAgentIdentity: MasumiAgentRegistration = masumiSDK.registerAgent(moodAgentConfig);

// Deploy Midnight Contract for this user's journal
let journalContract: CompactContract = midnightRuntime.deployContract("UserJournal", {});

// Simple hash function to simulate ZK proof generation
const generateZKProof = (content: string, score: number): string => {
  const data = `${content}-${score}-${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `zk-snark-mock-${Math.abs(hash).toString(16)}`;
};

export const journalStore = {
  getEntries: (): JournalEntry[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  addEntry: async (content: string, imageUrl?: string): Promise<JournalEntry> => {
    // 1. Execute analysis via Masumi Network (simulated)
    const analysisResult = await masumiSDK.executeTask(
      moodAgentIdentity.did,
      moodAgentIdentity.config.fee,
      () => {
        const analysis = sentiment.analyze(content);
        const score = analysis.score;
        let label: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
        if (score > 0) label = 'Positive';
        if (score < 0) label = 'Negative';
        return { score, label };
      }
    );

    const { score, label } = analysisResult.result;

    // 2. Store in Midnight Compact Contract (Private State)
    const midnightTx = await midnightRuntime.submitTransaction(
      journalContract,
      'addEntry',
      { content, score, timestamp: Date.now() }
    );

    // Update local contract state
    journalContract = midnightTx.newContract;

    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      content,
      timestamp: Date.now(),
      moodScore: score,
      moodLabel: label,
      imageUrl,
      zkProof: generateZKProof(content, score),
      masumiTxId: analysisResult.txHash,
      midnightProof: midnightTx.proof
    };

    const entries = journalStore.getEntries();
    const newEntries = [entry, ...entries];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
    } catch (error) {
      console.error("Storage failed:", error);
      // Fallback: Try saving without the image if it's too large
      if (imageUrl) {
        const entryWithoutImage = { ...entry, imageUrl: undefined };
        const newEntriesWithoutImage = [entryWithoutImage, ...entries];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntriesWithoutImage));
          return entryWithoutImage;
        } catch (retryError) {
          throw new Error("Failed to save entry even without image.");
        }
      }
      throw error;
    }
    return entry;
  },

  deleteEntry: (id: string) => {
    const entries = journalStore.getEntries().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
};
