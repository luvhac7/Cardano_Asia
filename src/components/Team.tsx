import { Card } from "@/components/ui/card";
import { Users, Award } from "lucide-react";

export const Team = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Meet the Builders</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 glow-text">
            Team DeCodeChain
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Building NEBULA with privacy-first personalized AI
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="glass-card p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold">
                K
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold">Kush</h3>
                  <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">Team Leader</div>
                </div>
                <p className="text-muted-foreground">Driving strategy and execution</p>
              </div>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p className="flex items-start gap-3">
                <span className="text-primary mt-1">▸</span>
                <span>Leading the development of NEBULA's decentralized platform</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-primary mt-1">▸</span>
                <span>Focus on delivering personalized AI insights while prioritizing user privacy</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-primary mt-1">▸</span>
                <span>Strong leadership ensuring cohesive development for hackathon goals</span>
              </p>
            </div>
          </Card>

          <Card className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-secondary/20">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold">Hackathon Submission</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div className="p-6 rounded-lg bg-muted/30">
                <div className="text-3xl font-bold text-primary mb-2">Cardano</div>
                <div className="text-muted-foreground">Hackathon Asia</div>
              </div>
              <div className="p-6 rounded-lg bg-muted/30">
                <div className="text-3xl font-bold text-secondary mb-2">IBW</div>
                <div className="text-muted-foreground">Edition 2025</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
