import { Hero } from "@/components/Hero";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Features } from "@/components/Features";
import { Problem } from "@/components/Problem";
import { Team } from "@/components/Team";
import { TechStack } from "@/components/TechStack";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <DashboardPreview />
      <Features />
      <Problem />
      <Team />
      <TechStack />
      <Footer />
    </div>
  );
};

export default Index;
