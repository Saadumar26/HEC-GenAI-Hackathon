import { createContext, useContext, useState, ReactNode } from "react";
import type { BrandProfile, GenerationResult } from "@workspace/api-client-react";

interface WizardState {
  brandName: string;
  websiteUrl: string;
  brandProfile: BrandProfile | null;
  intent: string;
  platforms: string[];
  toneOverride: string;
  additionalContext: string;
  generationResult: GenerationResult | null;
  setBrandName: (v: string) => void;
  setWebsiteUrl: (v: string) => void;
  setBrandProfile: (v: BrandProfile | null) => void;
  setIntent: (v: string) => void;
  setPlatforms: (v: string[]) => void;
  setToneOverride: (v: string) => void;
  setAdditionalContext: (v: string) => void;
  setGenerationResult: (v: GenerationResult | null) => void;
}

const WizardContext = createContext<WizardState | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [brandName, setBrandName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [intent, setIntent] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["linkedin"]);
  const [toneOverride, setToneOverride] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);

  return (
    <WizardContext.Provider
      value={{
        brandName,
        websiteUrl,
        brandProfile,
        intent,
        platforms,
        toneOverride,
        additionalContext,
        generationResult,
        setBrandName,
        setWebsiteUrl,
        setBrandProfile,
        setIntent,
        setPlatforms,
        setToneOverride,
        setAdditionalContext,
        setGenerationResult,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}
