import { useState } from "react";
import { useLocation } from "wouter";
import { useWizard } from "@/lib/store";
import { useEditPost } from "@workspace/api-client-react";
import type { PostVariation } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Edit2, Sparkles, CheckCircle2, ArrowLeft, Linkedin, Instagram, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Review() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { generationResult, brandProfile, contentBrief } = useWizard();
  
  const [activePlatform, setActivePlatform] = useState<string>("linkedin");
  const [editingPost, setEditingPost] = useState<PostVariation | null>(null);
  const [editInstruction, setEditInstruction] = useState("");
  const editMutation = useEditPost();

  // Local state for variations to allow updates after edit
  const [localPosts, setLocalPosts] = useState<{linkedin: PostVariation[], instagram: PostVariation[]} | null>(
    generationResult?.posts || null
  );

  if (!generationResult || !localPosts) {
    setLocation("/plan");
    return null;
  }

  const platforms = Object.keys(localPosts).filter(p => localPosts[p as keyof typeof localPosts]?.length > 0);
  
  if (platforms.length > 0 && !platforms.includes(activePlatform)) {
    setActivePlatform(platforms[0]);
  }

  const handleEditSubmit = () => {
    if (!editingPost || !editInstruction.trim() || !brandProfile || !contentBrief) return;

    editMutation.mutate({
      data: {
        caption: editingPost.caption,
        editInstruction,
        platform: editingPost.platform,
        brandProfile,
        contentBrief
      }
    }, {
      onSuccess: (result) => {
        // Update local state
        setLocalPosts(prev => {
          if (!prev) return prev;
          const platformPosts = [...prev[editingPost.platform as keyof typeof prev]];
          const index = platformPosts.findIndex(p => p.variationNumber === editingPost.variationNumber);
          if (index !== -1) {
            platformPosts[index] = {
              ...platformPosts[index],
              caption: result.caption,
              reviewScore: result.reviewScore,
              reviewNotes: result.reviewNotes
            };
          }
          return { ...prev, [editingPost.platform]: platformPosts };
        });
        setEditingPost(null);
        setEditInstruction("");
        toast({ title: "Post updated successfully" });
      },
      onError: () => {
        toast({ title: "Edit failed", variant: "destructive" });
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-500/10 border-green-500/20";
    if (score >= 6) return "text-amber-600 bg-amber-500/10 border-amber-500/20";
    return "text-red-600 bg-red-500/10 border-red-500/20";
  };

  const renderPostCard = (post: PostVariation) => {
    return (
      <Card key={post.variationNumber} className={`relative overflow-hidden transition-all duration-200 border-2 ${post.recommended ? "border-primary shadow-md" : "border-border"}`}>
        {post.recommended && (
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg z-10 flex items-center shadow-sm">
            <Sparkles className="w-3 h-3 mr-1" />
            Recommended
          </div>
        )}
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row h-full">
            {/* Visuals column */}
            <div className="w-full md:w-2/5 bg-muted border-r border-border relative flex-shrink-0 flex items-center justify-center overflow-hidden min-h-[300px]">
              {post.imageB64 ? (
                <div className="w-full h-full relative group">
                  <img 
                    src={`data:image/png;base64,${post.imageB64}`} 
                    alt="Generated post visual" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {post.overlayText && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                      <p className="text-white font-bold text-xl leading-tight font-serif drop-shadow-md">{post.overlayText}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-sm mb-4">
                    <span className="font-serif text-2xl font-bold opacity-50">T</span>
                  </div>
                  <p className="font-medium text-foreground">Text Only Post</p>
                  <p className="text-sm mt-2">{post.overlayText}</p>
                </div>
              )}
            </div>

            {/* Content column */}
            <div className="w-full md:w-3/5 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2 items-center">
                  <Badge variant="outline" className={getScoreColor(post.reviewScore)}>
                    Score: {post.reviewScore}/10
                  </Badge>
                  {post.hookType && <Badge variant="secondary" className="font-normal">{post.hookType}</Badge>}
                </div>
              </div>
              
              <div className="flex-1 bg-background rounded-md border border-border p-4 mb-4 overflow-y-auto max-h-[300px] text-sm whitespace-pre-wrap leading-relaxed">
                {post.caption}
              </div>

              <div className="bg-muted rounded-md p-3 mb-4 text-xs">
                <span className="font-semibold text-muted-foreground uppercase tracking-wider block mb-1">AI Review Notes</span>
                <p className="text-muted-foreground">{post.reviewNotes}</p>
              </div>

              <div className="flex gap-3 mt-auto">
                <Button variant="outline" className="flex-1 font-medium" onClick={() => setEditingPost(post)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Post
                </Button>
                <Button className="flex-1 font-medium">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Review & Export</h1>
          <p className="text-muted-foreground text-lg">Select the best variations and refine them.</p>
        </div>
        <Button variant="ghost" onClick={() => setLocation("/plan")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plan
        </Button>
      </div>

      <Tabs value={activePlatform} onValueChange={setActivePlatform} className="w-full">
        <TabsList className="w-full justify-start mb-8 h-auto p-1 bg-muted">
          {platforms.includes("linkedin") && (
            <TabsTrigger value="linkedin" className="py-2.5 px-6 data-[state=active]:shadow-sm">
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn ({localPosts.linkedin.length})
            </TabsTrigger>
          )}
          {platforms.includes("instagram") && (
            <TabsTrigger value="instagram" className="py-2.5 px-6 data-[state=active]:shadow-sm">
              <Instagram className="w-4 h-4 mr-2" />
              Instagram ({localPosts.instagram.length})
            </TabsTrigger>
          )}
        </TabsList>
        
        {platforms.includes("linkedin") && (
          <TabsContent value="linkedin" className="space-y-8 mt-0 focus-visible:outline-none">
            {localPosts.linkedin.map(renderPostCard)}
          </TabsContent>
        )}
        
        {platforms.includes("instagram") && (
          <TabsContent value="instagram" className="space-y-8 mt-0 focus-visible:outline-none">
            {localPosts.instagram.map(renderPostCard)}
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Post Variation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap text-muted-foreground max-h-[200px] overflow-y-auto border border-border">
              {editingPost?.caption}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">How should we improve this?</label>
              <Textarea 
                placeholder="e.g. Make it punchier, cut the second paragraph, add more focus to the AI features..."
                value={editInstruction}
                onChange={e => setEditInstruction(e.target.value)}
                className="h-24 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingPost(null)}>Cancel</Button>
            <Button onClick={handleEditSubmit} disabled={editMutation.isPending || !editInstruction.trim()}>
              {editMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {editMutation.isPending ? "Refining..." : "Refine Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
