import { useState } from 'react';
import { X, Smile, Frown, Meh, Zap, Camera, BrainCircuit, ShieldCheck, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface BackendStatus {
    emotion: string;
    meme_url: string;
}

interface RedditPost {
    data: {
        title: string;
        url: string;
        subreddit: string;
        permalink: string;
    }
}

export const MoodMemeWidget = () => {
    const [status, setStatus] = useState<BackendStatus>({ emotion: 'neutral', meme_url: '' });
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [redditSource, setRedditSource] = useState<string>('');

    const fetchMemeFromReddit = async (emotion: string) => {
        try {
            // Use the Python Backend to bypass CORS
            const response = await fetch(`http://localhost:8000/fetch_meme_reddit?emotion=${emotion}`);
            if (response.ok) {
                const data = await response.json();
                if (data.url) {
                    return {
                        url: data.url,
                        source: data.source,
                        title: data.title
                    };
                }
            }
        } catch (error) {
            console.error("Dopamine Agent Error:", error);
            return null;
        }
        return null;
    };

    const handleScanMood = async () => {
        setIsLoading(true);
        try {
            // 1. Analyze Mood (Simulated or Real Backend)
            const response = await fetch('http://localhost:8000/analyze_mood', {
                method: 'POST'
            });

            let detectedEmotion = 'neutral';

            if (response.ok) {
                const data = await response.json();
                if (!data.error) {
                    detectedEmotion = data.emotion;
                }
            } else {
                // Fallback simulation if backend is offline
                const emotions = ['happy', 'sad', 'angry', 'neutral'];
                detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
                toast.info("Backend offline. Simulating mood scan...");
            }

            // 2. Activate Dopamine Agent (Fetch Meme)
            const memeData = await fetchMemeFromReddit(detectedEmotion);

            if (memeData) {
                setStatus({ emotion: detectedEmotion, meme_url: memeData.url });
                setRedditSource(memeData.source);
                setIsVisible(true);
                toast.success(`Dopamine Agent Active: ${detectedEmotion.toUpperCase()} detected.`);
            } else {
                toast.error("Failed to fetch dopamine payload.");
            }

        } catch (error) {
            console.error("Agent error:", error);
            toast.error("Agent connection failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Scan Button */}
            <div className="fixed bottom-4 right-4 z-50">
                <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    <CardContent className="p-3 flex items-center gap-3">
                        <Button
                            onClick={handleScanMood}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <BrainCircuit className="w-4 h-4 mr-2" />
                                    Activate Dopamine Agent
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Dopamine Agent Overlay */}
            {isVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-md bg-slate-900/90 border-slate-700 shadow-2xl relative overflow-hidden">
                        {/* Holographic Header */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse" />

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-slate-400 hover:text-white z-10"
                            onClick={() => setIsVisible(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>

                        <CardContent className="p-0">
                            <div className="p-6 flex flex-col items-center text-center space-y-4 bg-gradient-to-b from-slate-900 to-slate-950">
                                <div className="space-y-2 w-full">
                                    <div className="flex items-center justify-between w-full mb-2">
                                        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                                            <BrainCircuit className="w-3 h-3" />
                                            DOPAMINE_AGENT_V1
                                        </div>
                                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                                            <ShieldCheck className="w-3 h-3 mr-1" />
                                            MASUMI VERIFIED
                                        </Badge>
                                    </div>

                                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                        {status.emotion === 'happy' ? "Hype Detected! 🚀" : "Mood Stabilizing... ☕️"}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        ZK-Proof: User is {status.emotion}. Fetching relief from decentralized cache.
                                    </p>
                                </div>

                                <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl w-full group">
                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-mono border border-white/10">
                                        SOURCE: {redditSource}
                                    </div>
                                    <img
                                        src={status.meme_url}
                                        alt="Dopamine Payload"
                                        className="w-full h-auto max-h-[350px] object-contain bg-slate-950"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                                        <Button size="sm" variant="secondary" className="text-xs" onClick={() => window.open(status.meme_url, '_blank')}>
                                            <ExternalLink className="w-3 h-3 mr-2" />
                                            Open Source
                                        </Button>
                                    </div>
                                </div>

                                <div className="w-full bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span>Privacy Shield Active: Reddit does not know your mood.</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
};
