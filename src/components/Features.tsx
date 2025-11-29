import { Card } from "@/components/ui/card";
import { Shield, Lock, Zap, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Shield,
    title: "ZK-Powered Wellness Journal",
    description: "Analyzes private journal entries for emotional insights with zero-knowledge privacy guarantees",
    color: "primary",
    link: "/journal"
  },
  {
    icon: Lock,
    title: "Private Financial Advisor",
    description: "Uses zero-knowledge proofs on transactions for tailored savings recommendations while maintaining privacy",
    color: "secondary",
    link: "/finance"
  },
  {
    icon: Activity,
    title: "Decentralized Habit Tracking",
    description: "Monitors habits, goals, and progress autonomously within a privacy-preserving framework",
    color: "primary",
    link: "/habits"
  },
  {
    icon: Zap,
    title: "Cardano Native Automation",
    description: "React-based dashboard with automated micro-fee payments via ADA for fully decentralized execution",
    color: "secondary",
    link: "/dashboard"
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 glow-text">
            Key Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Privacy-first AI agents delivering insights across wellness, finance, and productivity
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link}>
              <Card
                className="glass-card p-8 hover:shadow-glow transition-all duration-300 group cursor-pointer h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-4 rounded-xl bg-${feature.color}/20 group-hover:bg-${feature.color}/30 transition-colors mb-6`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                </div>

                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
