import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Zap, Target, Layers } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-sidebar text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 shadow-xl shadow-primary/5">
        <BrainCircuit className="w-10 h-10 text-primary" />
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl mb-6">
        The Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Social Media</span> Manager
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
        Provide a brand URL and an intent. BrandMind analyzes tone, extracts visual identity, and generates highly-converting variations optimized for LinkedIn and Instagram.
      </p>
      
      <Button 
        size="lg" 
        className="h-14 px-10 text-lg font-semibold rounded-full shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5"
        onClick={() => setLocation("/analyze")}
      >
        Get Started <Zap className="w-5 h-5 ml-2" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mt-24 text-left">
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Deep Analysis</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Extracts voice, tone, and color palettes directly from your website for perfect alignment.</p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Platform Optimized</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Tailors length, formatting, and structure specifically for LinkedIn and Instagram.</p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Self-Reviewing</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Multiple passes of generation ensure only high-scoring, quality content makes the cut.</p>
        </div>
      </div>
    </div>
  );
}
