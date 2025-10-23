import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Event } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Sparkles, Trophy, RefreshCw } from "lucide-react";
import { SpinWheel } from "@/components/spin-wheel";
import { ResultModal } from "@/components/result-modal";
import { useToast } from "@/hooks/use-toast";

export default function SpinWheelPage() {
  const [, params] = useRoute("/spin/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<{ result: string; isWinner: boolean } | null>(null);
  const [showResult, setShowResult] = useState(false);

  const participantId = params?.id;

  // Redirect if no participant ID
  useEffect(() => {
    if (!participantId) {
      setLocation("/");
    }
  }, [participantId, setLocation]);

  // Fetch events and participant data
  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: participant, isLoading: participantLoading } = useQuery({
    queryKey: ["/api/participant", participantId],
    enabled: !!participantId,
  });

  const spinMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/spin/${participantId}`, {});
    },
    onSuccess: (response) => {
      setSpinResult({
        result: response.result,
        isWinner: response.isWinner,
      });
      setTimeout(() => {
        setIsSpinning(false);
        setShowResult(true);
      }, 5000); // Show result after spin animation completes
    },
    onError: (error: any) => {
      setIsSpinning(false);
      toast({
        title: "Spin Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSpin = () => {
    if (participant?.spinResult) {
      toast({
        title: "Already Spun!",
        description: "You can only spin once per registration.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSpinning(true);
    spinMutation.mutate();
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setLocation("/");
  };

  if (eventsLoading || participantLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-body">Loading wheel...</p>
        </div>
      </div>
    );
  }

  if (!events || !participant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive font-body">Unable to load wheel data</p>
          <Button onClick={() => setLocation("/")} data-testid="button-back-home">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  // Check if already spun
  const alreadySpun = !!participant.spinResult;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-chart-2/10 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-screen">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 mb-2">
            <Trophy className="w-8 h-8 text-primary animate-pulse" />
          </div>
          
          <h1 className="font-display text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent">
            Spin the Wheel!
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground font-body">
            Welcome, <span className="text-foreground font-semibold" data-testid="text-participant-name">{participant.name}</span>
          </p>

          {alreadySpun && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-chart-3/30 bg-chart-3/10" data-testid="badge-previous-result">
              <Trophy className="w-4 h-4 text-chart-3" />
              <span className="text-sm font-medium text-foreground" data-testid="text-previous-result">
                Previous Result: {participant.spinResult}
              </span>
            </div>
          )}
        </div>

        {/* Wheel Component */}
        <div className="w-full max-w-2xl mb-8">
          <SpinWheel
            events={events}
            isSpinning={isSpinning}
            result={spinResult?.result || null}
          />
        </div>

        {/* Spin Button */}
        <div className="text-center space-y-4">
          {!alreadySpun ? (
            <Button
              size="lg"
              onClick={handleSpin}
              disabled={isSpinning || spinMutation.isPending}
              className="px-12 h-14 bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90 text-primary-foreground font-display text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-spin"
            >
              {isSpinning ? (
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>Spinning...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  <span>SPIN NOW</span>
                </div>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                You've already used your spin for this registration
              </p>
              <Button
                variant="outline"
                onClick={() => setLocation("/")}
                data-testid="button-register-again"
              >
                Register Again
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 max-w-md text-center">
          <p className="text-sm text-muted-foreground">
            {!alreadySpun 
              ? "Click the button to spin and discover if you've won a free event pass!" 
              : "Thank you for participating in the Vimal Jyothi Tech Fest!"}
          </p>
        </div>
      </div>

      {/* Result Modal */}
      {spinResult && (
        <ResultModal
          isOpen={showResult}
          result={spinResult.result}
          isWinner={spinResult.isWinner}
          participantName={participant.name}
          onClose={handleCloseResult}
        />
      )}
    </div>
  );
}
