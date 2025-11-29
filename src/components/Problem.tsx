import { Card } from "@/components/ui/card";
import { AlertTriangle, Lightbulb } from "lucide-react";

export const Problem = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Problem */}
          <Card className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-destructive/20">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-3xl font-bold">The Problem</h3>
            </div>

            <h4 className="text-xl font-semibold mb-4 text-foreground/90">
              Utility vs. Privacy
            </h4>

            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-destructive mt-1">▸</span>
                <span>Users want personalized AI for health, finance, and productivity</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive mt-1">▸</span>
                <span>Requires sharing highly sensitive information with centralized corporations</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive mt-1">▸</span>
                <span>Privacy risks include data leaks, misuse, and surveillance</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive mt-1">▸</span>
                <span>No widely adopted solution that delivers deep personal AI insights without compromising privacy</span>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm font-semibold text-destructive">
                Tradeoff: Improved utility vs. escalating privacy risks
              </p>
            </div>
          </Card>

          {/* Solution */}
          <Card className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/20">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">Our Solution</h3>
            </div>

            <h4 className="text-xl font-semibold mb-4 text-primary">
              Private, Decentralized Personal AI
            </h4>

            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary mt-1">✓</span>
                <span><strong className="text-foreground">Cardano:</strong> Secure on-chain dashboard for goal setting and insights</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary mt-1">✓</span>
                <span><strong className="text-foreground">Midnight:</strong> Zero-knowledge smart contracts that analyze sensitive data without exposing raw inputs</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary mt-1">✓</span>
                <span><strong className="text-foreground">Masumi AI:</strong> Decentralized network of agents interpreting private patterns</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary mt-1">✓</span>
                <span>Private, personalized assistance across health, productivity, and finance</span>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm font-semibold text-primary">
                Outcome: Deep insights without revealing raw data
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
