import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  BarChart, 
  PenTool, 
  Wand2, 
  CheckCircle2,
  BrainCircuit
} from "lucide-react";

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const steps = [
    { path: "/analyze", label: "Brand Setup", icon: BarChart },
    { path: "/plan", label: "Content Plan", icon: PenTool },
    { path: "/generate", label: "Generate", icon: Wand2 },
    { path: "/review", label: "Review", icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.path === location);
  const isHome = location === "/";

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {!isHome && (
        <aside className="w-64 border-r border-border bg-sidebar shrink-0 hidden md:block">
          <div className="p-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary tracking-tight">
              <BrainCircuit className="w-6 h-6" />
              <span>BrandMind</span>
            </Link>
          </div>
          
          <nav className="px-4 py-4 space-y-1">
            <div className="mb-6 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Creation Flow
            </div>
            
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = location === step.path;
              const isPast = currentStepIndex > index;
              
              return (
                <div
                  key={step.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : isPast
                        ? "text-foreground hover:bg-muted"
                        : "text-muted-foreground opacity-50 pointer-events-none"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {step.label}
                  {isPast && !isActive && <CheckCircle2 className="w-3 h-3 ml-auto opacity-50" />}
                </div>
              );
            })}
          </nav>
        </aside>
      )}
      
      <main className="flex-1 flex flex-col min-w-0">
        {!isHome && (
          <header className="h-14 border-b border-border flex items-center px-6 md:hidden">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary tracking-tight">
              <BrainCircuit className="w-5 h-5" />
              <span>BrandMind</span>
            </Link>
          </header>
        )}
        <div className="flex-1 overflow-auto">
          <div className={`max-w-5xl mx-auto h-full ${isHome ? "p-0" : "p-6 md:p-8"}`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
