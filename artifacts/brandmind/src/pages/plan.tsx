import { useLocation } from "wouter";
import { useWizard } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const INTENT_EXAMPLES = [
  "Announce a new product feature",
  "Share a customer success story",
  "Promote an upcoming webinar",
  "Company culture and hiring",
  "Industry insight or hot take"
];

export default function Plan() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { 
    intent, setIntent, 
    platforms, setPlatforms,
    toneOverride, setToneOverride,
    additionalContext, setAdditionalContext,
    brandProfile
  } = useWizard();

  // Redirect if no brand profile
  if (!brandProfile) {
    setLocation("/analyze");
    return null;
  }

  const handlePlatformToggle = (platform: string) => {
    setPlatforms(
      platforms.includes(platform) 
        ? platforms.filter(p => p !== platform)
        : [...platforms, platform]
    );
  };

  const handleContinue = () => {
    if (!intent.trim()) {
      toast({
        title: "Missing intent",
        description: "Please specify what you want to post about.",
        variant: "destructive"
      });
      return;
    }
    if (platforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please select at least one platform.",
        variant: "destructive"
      });
      return;
    }
    setLocation("/generate");
  };

  return (
    <div className="max-w-3xl mx-auto py-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Content Plan</h1>
        <p className="text-muted-foreground text-lg">What are we communicating today?</p>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="intent" className="text-base font-semibold">Primary Intent</Label>
            <span className="text-xs text-muted-foreground">Required</span>
          </div>
          <Textarea 
            id="intent"
            value={intent}
            onChange={e => setIntent(e.target.value)}
            placeholder="e.g. Announce our new AI features that help teams move 10x faster..."
            className="h-32 text-base resize-none"
          />
          <div className="flex flex-wrap gap-2">
            {INTENT_EXAMPLES.map(ex => (
              <Badge 
                key={ex} 
                variant="secondary" 
                className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors"
                onClick={() => setIntent(ex)}
              >
                {ex}
              </Badge>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <Label className="text-base font-semibold">Target Platforms</Label>
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer border-2 transition-all ${platforms.includes("linkedin") ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
              onClick={() => handlePlatformToggle("linkedin")}
            >
              <CardContent className="p-4 flex items-center space-x-3">
                <Checkbox checked={platforms.includes("linkedin")} id="linkedin" className="pointer-events-none" />
                <div className="font-medium">LinkedIn</div>
              </CardContent>
            </Card>
            <Card 
              className={`cursor-pointer border-2 transition-all ${platforms.includes("instagram") ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
              onClick={() => handlePlatformToggle("instagram")}
            >
              <CardContent className="p-4 flex items-center space-x-3">
                <Checkbox checked={platforms.includes("instagram")} id="instagram" className="pointer-events-none" />
                <div className="font-medium">Instagram</div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="toneOverride" className="text-base font-semibold">Tone Override</Label>
              <span className="text-xs text-muted-foreground">Optional</span>
            </div>
            <p className="text-sm text-muted-foreground">Current base tone: <span className="font-medium text-foreground">{brandProfile.tone}</span></p>
            <Textarea 
              id="toneOverride"
              value={toneOverride}
              onChange={e => setToneOverride(e.target.value)}
              placeholder="e.g. Make it slightly more aggressive than usual"
              className="h-24 resize-none"
            />
          </section>

          <section className="space-y-4">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="context" className="text-base font-semibold">Additional Context</Label>
              <span className="text-xs text-muted-foreground">Optional</span>
            </div>
            <p className="text-sm text-muted-foreground">Links, quotes, or exact phrasing to include.</p>
            <Textarea 
              id="context"
              value={additionalContext}
              onChange={e => setAdditionalContext(e.target.value)}
              placeholder="e.g. Include link https://acme.com/launch and quote from CEO"
              className="h-24 resize-none"
            />
          </section>
        </div>

        <div className="flex justify-between pt-6 border-t border-border">
          <Button variant="ghost" onClick={() => setLocation("/analyze")}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
          <Button size="lg" className="px-8 font-semibold" onClick={handleContinue}>
            Generate Content
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
