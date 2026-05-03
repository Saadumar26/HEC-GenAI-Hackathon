import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useWizard } from "@/lib/store";
import { useGeneratePosts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Zap, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Generate() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { 
    brandProfile, intent, platforms, toneOverride, additionalContext,
    setGenerationResult
  } = useWizard();
  
  const mutation = useGeneratePosts();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!brandProfile || !intent || platforms.length === 0) {
      setLocation("/plan");
      return;
    }

    if (!hasStarted.current) {
      hasStarted.current = true;
      mutation.mutate({
        data: {
          brandProfile,
          intent,
          platforms,
          toneOverride,
          additionalContext
        }
      }, {
        onSuccess: (data) => {
          setGenerationResult(data);
          setLocation("/review");
        },
        onError: (err) => {
          toast({
            title: "Generation failed",
            description: "Something went wrong during generation. Please try again.",
            variant: "destructive"
          });
        }
      });
    }
  }, [brandProfile, intent, platforms, toneOverride, additionalContext, mutation, setLocation, setGenerationResult, toast]);

  if (mutation.isError) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold">Generation Failed</h2>
        <p className="text-muted-foreground">We hit a snag while generating your content.</p>
        <Button onClick={() => setLocation("/plan")}>Go back and try again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-20">
      <Card className="border-primary/20 bg-card shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <CardContent className="pt-12 pb-12 flex flex-col items-center text-center space-y-8 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center relative border border-primary/30 shadow-[0_0_40px_rgba(var(--primary),0.2)]">
              <Zap className="w-10 h-10 text-primary animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Crafting Content</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Our AI is writing, reviewing, and refining multiple variations...
            </p>
          </div>

          <div className="w-full max-w-sm space-y-4 text-left">
            <div className="flex items-center gap-3 text-sm font-medium text-foreground">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              Creating content brief
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <Loader2 className="w-4 h-4 text-muted-foreground/50 animate-spin" />
              Generating captions
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <Loader2 className="w-4 h-4 text-muted-foreground/50 animate-spin" />
              Creating visuals
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <Loader2 className="w-4 h-4 text-muted-foreground/50 animate-spin" />
              Running self-review (3 rounds)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
