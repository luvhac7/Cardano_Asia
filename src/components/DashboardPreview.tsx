import { Card } from "@/components/ui/card";
import { Activity, DollarSign, Heart, TrendingUp, Brain, Target } from "lucide-react";

export const DashboardPreview = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 glow-text">
            Unified Intelligence Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three powerful AI agents working in harmony to optimize your life while preserving your privacy
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Wellness Widget */}
          <Card className="glass-card p-6 hover:shadow-glow transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Wellness</h3>
              </div>
              <Brain className="w-5 h-5 text-primary/60" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Mood Score</span>
                  <span className="text-primary font-semibold">8.2/10</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary w-[82%] rounded-full"></div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-primary/20">
                <p className="text-sm text-foreground/80 mb-2">
                  <span className="text-primary font-semibold">AI Insight:</span> Your mood improved 15% after morning workouts
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3" />
                  <span>Trend: Positive correlation with exercise</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-muted-foreground mb-1">Sleep Quality</div>
                  <div className="text-lg font-semibold text-primary">87%</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-muted-foreground mb-1">Activity</div>
                  <div className="text-lg font-semibold text-primary">12.3k</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Finance Widget */}
          <Card className="glass-card p-6 hover:shadow-glow transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-secondary/20 group-hover:bg-secondary/30 transition-colors">
                  <DollarSign className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold">Finance</h3>
              </div>
              <Brain className="w-5 h-5 text-secondary/60" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300 font-medium">Savings Progress</span>
                  <span className="text-secondary font-bold text-base">$8,400/$10,000</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary to-secondary/60 w-[84%] rounded-full shadow-[0_0_10px_rgba(var(--secondary),0.5)]"></div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/80 border border-secondary/30 shadow-inner">
                <p className="text-sm text-white mb-2">
                  <span className="text-secondary font-bold">AI Suggestion:</span> Reduce dining out by $200/month to reach goal faster
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Target className="w-3 h-3 text-secondary" />
                  <span>On track for 2 months early completion</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 mb-1">Monthly Budget</div>
                  <div className="text-lg font-bold text-white">$3.2k</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 mb-1">Saved</div>
                  <div className="text-lg font-bold text-green-400">18%</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Productivity Widget */}
          <Card className="glass-card p-6 hover:shadow-glow transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Productivity</h3>
              </div>
              <Brain className="w-5 h-5 text-primary/60" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Daily Goal Progress</span>
                  <span className="text-primary font-semibold">7/8 Tasks</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary w-[87.5%] rounded-full"></div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-primary/20">
                <p className="text-sm text-foreground/80 mb-2">
                  <span className="text-primary font-semibold">AI Insight:</span> Peak productivity between 9-11 AM. Schedule complex tasks then
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3" />
                  <span>Focus time increased 23% this week</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-muted-foreground mb-1">Focus Time</div>
                  <div className="text-lg font-semibold text-primary">4.5h</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-muted-foreground mb-1">Streak</div>
                  <div className="text-lg font-semibold text-primary">12 days</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
