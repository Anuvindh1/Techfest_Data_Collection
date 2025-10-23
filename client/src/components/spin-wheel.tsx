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

  // Create wheel segments - 6 events + 6 "Better Luck Next Time"
  // Use vibrant, distinct colors for "Better Luck Next Time" segments
  const betterLuckColors = [
    "#FF6B9D", // Bright Pink
    "#00D9FF", // Electric Cyan
    "#FFD93D", // Bright Yellow
    "#A855F7", // Vivid Purple
    "#4ADE80", // Lime Green
    "#FB923C"  // Vibrant Orange
  ];
  let betterLuckIndex = 0;
  const segments = events.flatMap(event => {
    const color = betterLuckColors[betterLuckIndex % betterLuckColors.length];
    betterLuckIndex++;
    return [
      { text: event.name, color: event.color, isEvent: true },
      { text: "Better Luck Next Time", color: color, isEvent: false }
    ];
  });

  const totalSegments = segments.length;
  const segmentAngle = 360 / totalSegments;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 30;

    // Clear canvas completely
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reset all transformations
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Save context state
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw outer glow ring
    ctx.save();
    ctx.shadowColor = "#8B5CF6";
    ctx.shadowBlur = 30;
    ctx.strokeStyle = "#8B5CF6";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, radius + 10, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();

    // Draw segments
    segments.forEach((segment, i) => {
      const startAngle = (i * segmentAngle * Math.PI) / 180;
      const endAngle = ((i + 1) * segmentAngle * Math.PI) / 180;

      // Draw segment with gradient
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Create gradient for all segments using their assigned colors
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      gradient.addColorStop(0, segment.color);
      gradient.addColorStop(0.6, segment.color);
      gradient.addColorStop(1, adjustBrightness(segment.color, -30));
      ctx.fillStyle = gradient;
      
      ctx.fill();

      // Draw bright white border for all segments to make them visually distinct
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Add shine effect for event segments
      if (segment.isEvent) {
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius * 0.5, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();

      // Draw text - simplified approach to ensure visibility in all segments
      const midAngle = startAngle + (endAngle - startAngle) / 2;
      
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Font styling optimized for 12 segments
      if (segment.isEvent) {
        ctx.font = "bold 12px 'Inter', system-ui, sans-serif";
        ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
        ctx.shadowBlur = 4;
      } else {
        ctx.font = "600 9px 'Inter', system-ui, sans-serif";
        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.shadowBlur = 3;
      }
      
      // Wrap text conservatively for narrow segments
      const maxWidth = radius * 0.30;
      const words = segment.text.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);

      // Limit to 2 lines to ensure text fits
      const displayLines = lines.slice(0, 2);
      const lineHeight = segment.isEvent ? 13 : 11;
      const textRadius = radius * 0.68;
      
      // Draw each line along the radius
      displayLines.forEach((line, lineIndex) => {
        ctx.save();
        
        // Rotate to segment midpoint
        ctx.rotate(midAngle);
        
        // Translate out to text position
        ctx.translate(textRadius, 0);
        
        // Rotate text to be perpendicular to radius (readable from outside)
        ctx.rotate(Math.PI / 2);
        
        // Offset for multiple lines
        const yPos = (lineIndex - (displayLines.length - 1) / 2) * lineHeight;
        ctx.fillText(line, 0, yPos);
        
        ctx.restore();
      });

      ctx.restore();
    });

    // Draw center circle with gradient
    const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
    centerGradient.addColorStop(0, "#8B5CF6");
    centerGradient.addColorStop(1, "#6D28D9");
    
    ctx.save();
    ctx.shadowColor = "#8B5CF6";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Draw center text with better styling
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px 'Inter', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.fillText("SPIN", 0, 0);
    ctx.restore();

    ctx.restore();

    // Draw modern pointer (triangle at top)
    ctx.save();
    ctx.translate(centerX, 40);
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    
    // Outer pointer shadow
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-20, -35);
    ctx.lineTo(20, -35);
    ctx.closePath();
    
    // Gradient for pointer
    const pointerGradient = ctx.createLinearGradient(0, -35, 0, 0);
    pointerGradient.addColorStop(0, "#FCD34D");
    pointerGradient.addColorStop(1, "#F59E0B");
    ctx.fillStyle = pointerGradient;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
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
      const randomOffset = Math.random() * segmentAngle * 0.6 - segmentAngle * 0.3;
      const spins = 6 + Math.random() * 3; // 6-9 full rotations
      const targetRotation = 360 * spins - targetSegmentAngle - randomOffset;

      const duration = 6000; // 6 seconds for smoother spin
      const startTime = Date.now();
      const startRotation = rotation;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function - ease out cubic with slight bounce
        const eased = 1 - Math.pow(1 - progress, 3.5);
        
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
    <div className="relative flex items-center justify-center p-4">
      <div className="relative">
        {/* Outer neon glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-chart-2 to-primary blur-3xl opacity-40 animate-pulse" 
             style={{ transform: "scale(1.1)" }} />
        
        {/* Canvas container with subtle rotation */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={650}
            height={650}
            className="relative max-w-full h-auto"
            style={{
              filter: isSpinning ? "blur(1px) brightness(1.1)" : "none",
              transition: "filter 0.3s ease",
              transform: isSpinning ? "scale(1.02)" : "scale(1)",
              transitionDuration: "0.3s"
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Helper function to adjust color brightness
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1).toUpperCase();
}
