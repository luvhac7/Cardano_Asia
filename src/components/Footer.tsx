import { Brain, Github, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Brain className="w-6 h-6 text-background" />
            </div>
            <div>
              <div className="text-xl font-bold">NEBULA</div>
              <div className="text-sm text-muted-foreground">Team DeCodeChain</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          <div className="text-sm text-muted-foreground text-center md:text-right">
            <div>Cardano Hackathon Asia - IBW Edition 2025</div>
            <div className="text-xs mt-1">Built with privacy, powered by decentralization</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
