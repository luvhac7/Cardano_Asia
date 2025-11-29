import { useState, useEffect, useRef } from "react";
import { journalStore, JournalEntry } from "@/lib/journalStore";
import { MoodAgent } from "@/components/MoodAgent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, PenLine, Trash2, Shield, Zap, Image as ImageIcon, X, Save, History, Fingerprint, Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EncryptedText } from "@/components/encryption/EncryptedText";
import { EncryptedImage } from "@/components/encryption/EncryptedImage";
import { ScrollArea } from "@/components/ui/scroll-area";

const Journal = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [newEntry, setNewEntry] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isEncrypting, setIsEncrypting] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        setEntries(journalStore.getEntries());
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await transcribeAudio(audioBlob);

                // Stop all tracks to release mic
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsListening(true);
            toast.info("Listening... Speak now.");
        } catch (error) {
            console.error("Error accessing microphone:", error);
            toast.error("Microphone access denied. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isListening) {
            mediaRecorderRef.current.stop();
            setIsListening(false);
            setIsTranscribing(true);
        }
    };

    const transcribeAudio = async (audioBlob: Blob) => {
        try {
            const formData = new FormData();
            formData.append("file", audioBlob, "recording.webm");

            const response = await fetch("http://localhost:8000/transcribe", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.transcription) {
                setNewEntry(prev => prev + (prev ? ' ' : '') + data.transcription);
                toast.success("Transcription complete!");
            } else if (data.error) {
                toast.error(`Transcription failed: ${data.error}`);
            }
        } catch (error) {
            console.error("Transcription error:", error);
            toast.error("Failed to connect to transcription service.");
        } finally {
            setIsTranscribing(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Resize image to avoid localStorage limits
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800; // Limit width to 800px
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // Compress quality
                    setSelectedImage(compressedBase64);
                };
            };
            reader.readAsDataURL(file);
        }
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    const handleSave = async () => {
        if (!newEntry.trim() && !selectedImage) return;

        setIsEncrypting(true);

        // Simulate encryption delay for effect
        setTimeout(async () => {
            try {
                const entry = await journalStore.addEntry(newEntry, selectedImage || undefined);
                setEntries([entry, ...entries]);
                setNewEntry("");
                setSelectedImage(null);
                toast.success("Entry encrypted & stored on Midnight Network");
            } catch (error) {
                console.error(error);
                toast.error("Failed to save entry. Image might be too large.");
            } finally {
                setIsEncrypting(false);
            }
        }, 1200);
    };

    const handleDelete = (id: string) => {
        journalStore.deleteEntry(id);
        setEntries(entries.filter(e => e.id !== id));
        toast.success("Entry deleted.");
    };

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-7xl min-h-screen text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <Lock className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200">
                            ZK Wellness Vault
                        </h1>
                        <p className="text-slate-400">Private, secure, and mood-aware journaling.</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <Shield className="w-3 h-3 text-emerald-500" />
                    <span>Zero-Knowledge Architecture Active</span>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                {/* Left Column: Editor */}
                <div className="space-y-6">
                    <Card className="border-emerald-500/20 bg-black/40 backdrop-blur-md shadow-2xl shadow-emerald-900/10 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-50" />
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <PenLine className="w-5 h-5 text-emerald-400" />
                                Digital Diary
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Your thoughts are encrypted locally before storage.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-4">
                                <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/5">
                                    <Fingerprint className="w-3 h-3 mr-1" />
                                    Biometric Lock Ready
                                </Badge>
                                <Badge variant="outline" className="text-[10px] border-teal-500/30 text-teal-400 bg-teal-500/5">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Masumi AI Active
                                </Badge>
                            </div>

                            <div className="relative group">
                                <Textarea
                                    placeholder="How are you feeling today?"
                                    className="min-h-[200px] mb-4 resize-none bg-white/5 border-white/10 focus:border-emerald-500/50 text-white placeholder:text-slate-500 p-4 text-lg leading-relaxed transition-all"
                                    value={newEntry}
                                    onChange={(e) => setNewEntry(e.target.value)}
                                    disabled={isTranscribing}
                                />
                                <div className="absolute bottom-6 right-4 text-xs text-slate-500 pointer-events-none group-focus-within:text-emerald-500/50 transition-colors">
                                    {newEntry.length} chars
                                </div>
                            </div>

                            {/* Image Preview */}
                            {selectedImage && (
                                <div className="relative mb-4 rounded-xl overflow-hidden border border-white/10 inline-block group">
                                    <img src={selectedImage} alt="Preview" className="h-40 w-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => setSelectedImage(null)}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-slate-400 hover:text-white hover:bg-white/10"
                                    >
                                        <ImageIcon className="w-4 h-4 mr-2" />
                                        Add Photo
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={toggleListening}
                                        disabled={isTranscribing}
                                        className={`text-slate-400 hover:text-white hover:bg-white/10 ${isListening ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20 animate-pulse' : ''} ${isTranscribing ? 'text-emerald-400' : ''}`}
                                    >
                                        {isTranscribing ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : isListening ? (
                                            <MicOff className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Mic className="w-4 h-4 mr-2" />
                                        )}
                                        {isTranscribing ? 'Transcribing...' : isListening ? 'Stop' : 'Dictate'}
                                    </Button>
                                </div>

                                <Button
                                    onClick={handleSave}
                                    disabled={(!newEntry.trim() && !selectedImage) || isEncrypting}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px] shadow-lg shadow-emerald-900/20"
                                >
                                    {isEncrypting ? (
                                        <>
                                            <Zap className="w-4 h-4 mr-2 animate-pulse" />
                                            Encrypting...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Encrypt & Save
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Vault Timeline */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <History className="w-5 h-5 text-slate-400" />
                        <h2 className="text-lg font-semibold text-white">Vault Timeline</h2>
                    </div>

                    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                        <div className="space-y-4">
                            {entries.length === 0 && (
                                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-white/5">
                                    <Lock className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-500">Vault is empty.</p>
                                    <p className="text-xs text-slate-600 mt-1">Start writing to secure your memories.</p>
                                </div>
                            )}
                            {entries.map((entry) => (
                                <div key={entry.id} className="relative pl-6 border-l border-white/10 hover:border-emerald-500/50 transition-colors group">
                                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-800 border-2 border-slate-950 group-hover:bg-emerald-500 transition-colors" />

                                    <Card className="overflow-hidden border-white/5 bg-white/5 hover:bg-white/10 transition-all">
                                        <CardHeader className="pb-2 pt-3 px-4 flex flex-row items-start justify-between space-y-0">
                                            <div className="text-xs text-slate-400 font-mono">
                                                {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {new Date(entry.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-slate-500 hover:text-red-400 -mr-2"
                                                onClick={() => handleDelete(entry.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4">
                                            {/* Encrypted Image */}
                                            {entry.imageUrl && (
                                                <div className="w-full h-32 bg-black/50 rounded-lg overflow-hidden mb-3 border border-white/10">
                                                    <EncryptedImage
                                                        src={entry.imageUrl}
                                                        alt="Encrypted Memory"
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                            )}

                                            {/* Encrypted Text */}
                                            <div className="mb-3">
                                                <EncryptedText
                                                    text={entry.content}
                                                    className="whitespace-pre-wrap leading-relaxed text-slate-300 text-sm line-clamp-4 group-hover:line-clamp-none transition-all"
                                                />
                                            </div>

                                            <MoodAgent entry={entry} />
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export default Journal;
