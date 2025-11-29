import { Card } from "@/components/ui/card";
import { Boxes, Database, Shield, Cpu } from "lucide-react";

const techCategories = [
  {
    icon: Boxes,
    title: "Frontend & Identity",
    items: ["React with TypeScript", "Atala PRISM for DID"],
    color: "primary"
  },
  {
    icon: Database,
    title: "Blockchain & Smart Contracts",
    items: ["Cardano with Plutus", "Public Goals & ADA Payments"],
    color: "secondary"
  },
  {
    icon: Shield,
    title: "Privacy & ZK Processing",
    items: ["Midnight Zero-Knowledge VM", "ZK-Proofs Only Output"],
    color: "primary"
  },
  {
    icon: Cpu,
    title: "AI, Storage & Backend",
    items: ["Masumi AI Agent Framework", "Kafka, Redis, IPFS, LLM Clusters"],
    color: "secondary"
  }
];

export const TechStack = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 glow-text">
            Tech Stack & Integration
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Private data protection with zk-proofs, on-chain goals, and ADA payment verification
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {techCategories.map((category, index) => (
            <Card 
              key={index}
              className="glass-card p-8 hover:shadow-glow transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-xl bg-${category.color}/20 group-hover:bg-${category.color}/30 transition-colors`}>
                  <category.icon className={`w-7 h-7 text-${category.color}`} />
                </div>
                <h3 className="text-2xl font-bold">{category.title}</h3>
              </div>

              <ul className="space-y-3">
                {category.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                    <div className={`w-2 h-2 rounded-full bg-${category.color}`}></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Process Flow */}
        <Card className="glass-card p-8 mt-12 max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">NEBULA Process Flow</h3>
          
          <div className="grid md:grid-cols-7 gap-4 items-center">
            {[
              { step: "1", label: "User Input", icon: "📝" },
              { step: "→", label: "", icon: "" },
              { step: "2", label: "ZK-VM Processing", icon: "🔐" },
              { step: "→", label: "", icon: "" },
              { step: "3", label: "AI Agents", icon: "🤖" },
              { step: "→", label: "", icon: "" },
              { step: "4", label: "DApp Output", icon: "✨" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                {item.icon && (
                  <>
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                  </>
                )}
                {!item.icon && item.step === "→" && (
                  <div className="text-2xl text-primary">→</div>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Private data → Midnight ZK-VM → Masumi AI Agents → Dashboard feedback with Cardano automation
          </p>
        </Card>
      </div>
    </section>
  );
};
