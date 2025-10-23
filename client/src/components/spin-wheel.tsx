import { useEffect, useRef, useState } from "react";
import { type Event } from "@shared/schema";

interface SpinWheelProps {
  events: Event[];
  isSpinning: boolean;
  result: string | null;
}

export function SpinWheel({ events, isSpinning, result }: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number>();

  // Create wheel segments - 5 events + 5 "Better Luck Next Time"
  const segments = events.flatMap(event => [
    { text: event.name, color: event.color, isEvent: true },
    { text: "Better Luck Next Time", color: "#6B7280", isEvent: false }
  ]);

  const totalSegments = segments.length;
  const segmentAngle = 360 / totalSegments;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw segments
    segments.forEach((segment, i) => {
      const startAngle = (i * segmentAngle * Math.PI) / 180;
      const endAngle = ((i + 1) * segmentAngle * Math.PI) / 180;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Add inner glow for event segments
      if (segment.isEvent) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius * 0.7, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.restore();
      }

      // Draw text
      ctx.save();
      const textAngle = startAngle + (endAngle - startAngle) / 2;
      ctx.rotate(textAngle);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.font = segment.isEvent ? "bold 16px Orbitron" : "14px Inter";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 4;
      
      // Wrap text for long event names
      const maxWidth = radius * 0.6;
      const words = segment.text.split(" ");
      let line = "";
      let y = radius * 0.65;

      words.forEach((word, index) => {
        const testLine = line + word + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && index > 0) {
          ctx.fillText(line, 0, y);
          line = word + " ";
          y += 20;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, 0, y);

      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, 2 * Math.PI);
    ctx.fillStyle = "#8B5CF6";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw center text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Orbitron";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", 0, 0);

    ctx.restore();

    // Draw pointer
    ctx.save();
    ctx.translate(centerX, 20);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-15, -30);
    ctx.lineTo(15, -30);
    ctx.closePath();
    ctx.fillStyle = "#EF4444";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Draw outer ring glow
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.beginPath();
    ctx.arc(0, 0, radius + 5, 0, 2 * Math.PI);
    ctx.strokeStyle = "#8B5CF6";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#8B5CF6";
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.restore();

  }, [rotation, segments, segmentAngle]);

  useEffect(() => {
    if (isSpinning && result) {
      // Find the index of the result
      const resultIndex = segments.findIndex(seg => seg.text === result);
      if (resultIndex === -1) return;

      // Calculate target rotation
      const targetSegmentAngle = resultIndex * segmentAngle;
      const randomOffset = Math.random() * segmentAngle * 0.8 - segmentAngle * 0.4;
      const spins = 5 + Math.random() * 2; // 5-7 full rotations
      const targetRotation = 360 * spins - targetSegmentAngle - randomOffset;

      const duration = 5000; // 5 seconds
      const startTime = Date.now();
      const startRotation = rotation;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function - ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        
        const currentRotation = startRotation + (targetRotation - startRotation) * eased;
        setRotation(currentRotation % 360);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isSpinning, result, segments, segmentAngle, rotation]);

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-chart-2 to-primary blur-2xl opacity-30 animate-pulse-glow" />
        
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="relative max-w-full h-auto drop-shadow-2xl"
          style={{
            filter: isSpinning ? "blur(2px)" : "none",
            transition: "filter 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
