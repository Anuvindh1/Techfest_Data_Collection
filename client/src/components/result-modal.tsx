import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, PartyPopper } from "lucide-react";

interface ResultModalProps {
  isOpen: boolean;
  result: string;
  isWinner: boolean;
  participantName: string;
  onClose: () => void;
}

export function ResultModal({ isOpen, result, isWinner, participantName, onClose }: ResultModalProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    if (isOpen && isWinner) {
      // Generate confetti
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setConfetti(particles);
    }
  }, [isOpen, isWinner]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md border-2 backdrop-blur-xl"
        style={{
          borderColor: isWinner ? "hsl(var(--chart-3))" : "hsl(var(--chart-4))",
          backgroundColor: isWinner ? "hsl(var(--card) / 0.95)" : "hsl(var(--card) / 0.95)",
        }}
        data-testid="modal-result"
      >
        {/* Confetti for winners */}
        {isWinner && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-2 h-2 animate-confetti"
                style={{
                  left: `${particle.left}%`,
                  top: "-10px",
                  backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                  animationDelay: `${particle.delay}s`,
                }}
              />
            ))}
          </div>
        )}

        <DialogHeader className="text-center space-y-4 pt-6">
          <div className="flex justify-center">
            {isWinner ? (
              <div className="relative">
                <Trophy className="w-24 h-24 text-chart-3 animate-float" />
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-chart-2 animate-pulse" />
              </div>
            ) : (
              <PartyPopper className="w-24 h-24 text-chart-4" />
            )}
          </div>

          <DialogTitle className="font-display text-3xl md:text-4xl">
            {isWinner ? (
              <span className="bg-gradient-to-r from-chart-3 to-primary bg-clip-text text-transparent">
                Congratulations!
              </span>
            ) : (
              <span className="text-foreground">
                Better Luck Next Time!
              </span>
            )}
          </DialogTitle>

          <div className="text-base md:text-lg space-y-4">
            {isWinner ? (
              <>
                <p className="text-foreground font-semibold">
                  {participantName}, you've won!
                </p>
                <div className="bg-gradient-to-r from-chart-3/20 to-primary/20 border border-chart-3/30 rounded-lg p-4 my-4">
                  <p className="text-2xl font-display font-bold text-foreground" data-testid="text-win-result">
                    {result}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Free Event Pass
                  </p>
                </div>
                <p className="text-muted-foreground text-sm">
                  Show this confirmation at the event desk to claim your free pass!
                </p>
              </>
            ) : (
              <>
                <p className="text-foreground">
                  Thank you for participating, {participantName}!
                </p>
                <p className="text-muted-foreground">
                  We appreciate your interest in Vimal Jyothi Tech Fest. Don't forget to explore all our amazing events on October 24, 2025!
                </p>
              </>
            )}
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          <Button
            size="lg"
            className="bg-gradient-to-r from-chart-3 to-primary hover:from-chart-3/90 hover:to-primary/90 text-primary-foreground font-semibold shadow-lg"
            onClick={onClose}
            data-testid="button-close-result"
          >
            {isWinner ? "Continue" : "Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
