import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useWizard } from "@/lib/store";
import { useAnalyzeBrand } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2, Link2, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Analyze() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { brandName, setBrandName, websiteUrl, setWebsiteUrl, brandProfile, setBrandProfile } = useWizard();
  const mutation = useAnalyzeBrand();

  const handleAnalyze = () => {
    if (!brandName || !websiteUrl) {
      toast({
        title: "Missing fields",
        description: "Please enter both brand name and website URL.",
        variant: "destructive"
      });
      return;
    }

    mutation.mutate({
      data: {
        brandName,
        websiteUrl
      }
    }, {
      onSuccess: (data) => {
        setBrandProfile(data);
      },
      onError: (err) => {
        toast({
          title: "Analysis failed",
          description: "Could not analyze the brand. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Brand Setup</h1>
        <p className="text-muted-foreground text-lg">Define the brand identity we'll be writing for.</p>
      </div>

      {!brandProfile && !mutation.isPending && (
        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle>Brand Details</CardTitle>
            <CardDescription>Enter the core details to extract tone and visual identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="brandName" 
                  value={brandName} 
                  onChange={e => setBrandName(e.target.value)} 
                  placeholder="e.g. Acme Corp" 
                  className="pl-9 h-11"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="websiteUrl" 
                  type="url"
                  value={websiteUrl} 
                  onChange={e => setWebsiteUrl(e.target.value)} 
                  placeholder="https://example.com" 
                  className="pl-9 h-11"
                />
              </div>
            </div>

            <Button 
              className="w-full h-11 font-semibold" 
              onClick={handleAnalyze}
            >
              Analyze Brand Identity
            </Button>
          </CardContent>
        </Card>
      )}

      {mutation.isPending && (
        <Card className="border-primary/20 bg-primary/5 shadow-md">
          <CardContent className="pt-6 flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h3 className="text-xl font-semibold">Analyzing {brandName || "Brand"}</h3>
            <div className="text-muted-foreground text-sm space-y-2">
              <p className="animate-pulse">Scraping website content...</p>
              <p className="animate-pulse delay-75">Extracting brand voice & tone...</p>
              <p className="animate-pulse delay-150">Analyzing visual style...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {brandProfile && !mutation.isPending && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border shadow-md overflow-hidden">
            <div className="bg-muted px-6 py-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{brandProfile.brandName}</h3>
                <p className="text-sm text-muted-foreground">Brand Profile Extracted</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setBrandProfile(null)}>
                Recalculate
              </Button>
            </div>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Core Voice</h4>
                  <p className="font-medium text-base">{brandProfile.tone}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{brandProfile.voiceDescription}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Visual Style</h4>
                  <p className="text-sm">{brandProfile.visualStyle}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Colors</h4>
                  <div className="flex gap-2">
                    {brandProfile.colorPalette.map(hex => (
                      <div 
                        key={hex} 
                        className="w-8 h-8 rounded-full border shadow-sm" 
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {brandProfile.keywords.map(kw => (
                      <Badge key={kw} variant="secondary" className="font-normal">{kw}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Emoji Usage</h4>
                    <p className="text-sm">{brandProfile.emojiUsage}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">CTA Style</h4>
                    <p className="text-sm">{brandProfile.ctaStyle}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button size="lg" className="px-8 font-semibold" onClick={() => setLocation("/plan")}>
              Continue to Planning
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
