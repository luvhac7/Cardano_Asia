import { useState, useEffect } from "react";
import { habitStore, Habit, HabitInsight } from "@/lib/habitStore";
import { HabitCalendar } from "@/components/habits/HabitCalendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Settings, Flame, Droplets, BookOpen, Monitor, Activity } from "lucide-react";
import { toast } from "sonner";

const Habits = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [newHabit, setNewHabit] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        setHabits(habitStore.getHabits());
    };

    const handleAddHabit = () => {
        if (!newHabit.trim()) return;
        habitStore.addHabit(newHabit);
        refreshData();
        setNewHabit("");
        setIsDialogOpen(false);
        toast.success("Habit created successfully");
    };

    const handleToggle = (id: string) => {
        habitStore.toggleHabit(id);
        refreshData();
    };

    const getIcon = (title: string) => {
        const lower = title.toLowerCase();
        if (lower.includes("water") || lower.includes("hydrate")) return <Droplets className="w-5 h-5 text-blue-400" />;
        if (lower.includes("read") || lower.includes("book")) return <BookOpen className="w-5 h-5 text-yellow-400" />;
        if (lower.includes("code") || lower.includes("work")) return <Monitor className="w-5 h-5 text-purple-400" />;
        return <Activity className="w-5 h-5 text-green-400" />;
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl min-h-screen text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-800 overflow-hidden border-2 border-slate-700">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Sefa Bulak</h1>
                        <p className="text-slate-500 text-sm">// Silence is golden.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
                                <Plus className="w-4 h-4 mr-2" /> Create
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-800 text-white">
                            <DialogHeader>
                                <DialogTitle>Create New Habit</DialogTitle>
                            </DialogHeader>
                            <div className="flex gap-2 mt-4">
                                <Input
                                    value={newHabit}
                                    onChange={(e) => setNewHabit(e.target.value)}
                                    placeholder="e.g. Morning Jog"
                                    className="bg-slate-950 border-slate-800"
                                />
                                <Button onClick={handleAddHabit}>Add</Button>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-800">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-xs text-slate-400 hover:text-primary"
                                    onClick={() => {
                                        const count = habitStore.generateAIHabits();
                                        refreshData();
                                        setIsDialogOpen(false);
                                        if (count > 0) toast.success(`AI added ${count} habits!`);
                                    }}
                                >
                                    <Activity className="w-3 h-3 mr-2" />
                                    Generate AI Routine
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800">
                        <Settings className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_350px] gap-8">
                {/* Habits List */}
                <div className="space-y-4">
                    {habits.map((habit) => (
                        <Card key={habit.id} className="bg-[#0A0A0A] border-slate-800/50 hover:border-slate-700 transition-colors group">
                            <CardContent className="p-6 flex items-center justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {getIcon(habit.title)}
                                        <h3 className="text-lg font-semibold text-white">{habit.title}</h3>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                                        Consistent effort builds the best version of yourself.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Flame className={`w-3 h-3 ${habit.streak > 0 ? 'text-orange-500' : ''}`} />
                                        <span className={habit.streak > 0 ? 'text-orange-400' : ''}>{habit.streak} day streak</span>
                                    </div>
                                </div>

                                {/* Mini Heatmap */}
                                <div
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => handleToggle(habit.id)}
                                >
                                    <HabitCalendar history={habit.history} variant="mini" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {habits.length === 0 && (
                        <div className="text-center py-20 text-slate-600 border border-dashed border-slate-800 rounded-xl">
                            No habits yet. Create one to start tracking!
                        </div>
                    )}
                </div>

                {/* Statistics Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-[#0A0A0A] border-slate-800/50 p-6">
                        <h3 className="text-lg font-semibold text-white mb-6">Productivity</h3>
                        <div className="relative flex items-center justify-center py-4">
                            {/* Simple SVG Gauge */}
                            <svg viewBox="0 0 100 50" className="w-full h-32">
                                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                                <path d="M 10 50 A 40 40 0 0 1 75 22" fill="none" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" />
                            </svg>
                            <div className="absolute bottom-4 text-center">
                                <span className="text-3xl font-bold text-white">80%</span>
                                <p className="text-xs text-slate-500">Current Productivity</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 text-center mt-4">
                            You can do it! Just make sure you complete all your habits.
                        </p>
                    </Card>

                    <Card className="bg-[#0A0A0A] border-slate-800/50 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-400">Habits</h3>
                            <span className="text-xs text-slate-600">Last 7 days</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Simple Donut Chart */}
                            <div className="relative w-24 h-24">
                                <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="3" />
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="45, 100" />
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 14.5 22" fill="none" stroke="#eab308" strokeWidth="3" strokeDasharray="30, 100" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-lg font-bold text-white">45%</span>
                                    <span className="text-[8px] text-slate-500">Drink water</span>
                                </div>
                            </div>
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span className="text-slate-400">Water</span>
                                    </div>
                                    <span className="text-white">45%</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        <span className="text-slate-400">Read</span>
                                    </div>
                                    <span className="text-white">25%</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-slate-400">Code</span>
                                    </div>
                                    <span className="text-white">15%</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Habits;
