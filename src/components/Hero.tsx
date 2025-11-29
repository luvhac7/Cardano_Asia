import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BrainCircuit, Shield, Zap, PenLine, Wallet, Fingerprint, Ghost, Database, HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted">
        <div className="absolute inset-0 bg-gradient-glow opacity-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Cardano Hackathon Asia - IBW Edition 2025</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 glow-text bg-gradient-primary bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.2s' }}>
          NEBULA
        </h1>

        <p className="text-2xl md:text-3xl text-foreground/90 mb-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Your Private AI Life-Copilot
        </p>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          A privacy-first decentralized AI assistant built on Cardano that balances personalized insights with complete user control over sensitive data
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <Link to="/dashboard">
            <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6">
              <BrainCircuit className="w-5 h-5 mr-2" />
              Launch Dashboard
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/50 hover:bg-primary/10 text-lg px-8 py-6"
            onClick={scrollToFeatures}
          >
            <Shield className="w-5 h-5 mr-2" />
            Learn More
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-300 mt-8">
          <Link to="/journal">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-2xl shadow-lg shadow-emerald-900/20 transition-all hover:scale-105">
              <PenLine className="mr-2 h-5 w-5" />
              Wellness Journal
            </Button>
          </Link>
          <Link to="/finance">
            <Button size="lg" variant="outline" className="border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 px-8 py-6 text-lg rounded-2xl backdrop-blur-sm transition-all hover:scale-105">
              <Wallet className="mr-2 h-5 w-5" />
              Financial Advisor
            </Button>
          </Link>
          <Link to="/habits">
            <Button size="lg" variant="outline" className="border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 text-teal-400 px-8 py-6 text-lg rounded-2xl backdrop-blur-sm transition-all hover:scale-105">
              <Zap className="mr-2 h-5 w-5" />
              Life-Copilot
            </Button>
          </Link>
          <Link to="/identity">
            <Button size="lg" variant="outline" className="border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 px-8 py-6 text-lg rounded-2xl backdrop-blur-sm transition-all hover:scale-105">
              <Fingerprint className="mr-2 h-5 w-5" />
              Nebula ID
            </Button>
          </Link>
          <Link to="/echo">
            <Button size="lg" variant="outline" className="border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 px-8 py-6 text-lg rounded-2xl backdrop-blur-sm transition-all hover:scale-105">
              <Ghost className="mr-2 h-5 w-5" />
              Nebula Echo
            </Button>
          </Link>
          <Link to="/dao">
            <Button size="lg" variant="outline" className="border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400 px-8 py-6 text-lg rounded-2xl backdrop-blur-sm transition-all hover:scale-105">
              <Database className="mr-2 h-5 w-5" />
              Data DAO
            </Button>
          </Link>
          <Link to="/pulse">
            <Button size="lg" variant="outline" className="border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10 text-pink-400 px-8 py-6 text-lg rounded-2xl backdrop-blur-sm transition-all hover:scale-105">
              <HeartPulse className="mr-2 h-5 w-5" />
              Nebula Pulse
            </Button>
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-12 animate-fade-in" style={{ animationDelay: '1s' }}>
          {['Zero-Knowledge Privacy', 'Cardano Native', 'AI-Powered Insights'].map((feature) => (
            <div key={feature} className="px-4 py-2 rounded-full glass-card text-sm text-foreground/80">
              {feature}
            </div>
          ))}
        </div>
        {/* Social Links */}
        <div className="mt-12 flex justify-center gap-6">
          <a href="https://github.com/luvhac7/Cardano_Asia" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
