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

          <DialogDescription className="text-base md:text-lg space-y-4">
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
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          {isWinner && (
            <Button
              size="lg"
              className="bg-gradient-to-r from-chart-3 to-primary hover:from-chart-3/90 hover:to-primary/90 text-primary-foreground font-semibold shadow-lg"
              onClick={() => {
                // Share on WhatsApp
                const text = `🎉 I just won a free pass to ${result} at Vimal Jyothi Tech Fest 2025! Spin your wheel at the fest to win amazing prizes! #VJTechFest2025`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
              }}
              data-testid="button-share"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Share on WhatsApp</span>
              </div>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="lg"
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
