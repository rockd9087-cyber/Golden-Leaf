import React, { useEffect, useRef, useState } from 'react';

interface InteractiveForestAndCursorProps {
  enabled: boolean;
}

interface TrailLeaf {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
}

export const InteractiveForestAndCursor: React.FC<InteractiveForestAndCursorProps> = ({
  enabled,
}) => {
  const leafCursorRef = useRef<HTMLDivElement | null>(null);
  const canopyLeftRef = useRef<SVGSVGElement | null>(null);
  const canopyRightRef = useRef<SVGSVGElement | null>(null);
  const [trailLeaves, setTrailLeaves] = useState<TrailLeaf[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let currentAngle = -35;
    let lastTrailTime = 0;
    let trailCounter = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      const now = performance.now();
      const speed = Math.hypot(targetX - currentX, targetY - currentY);
      if (speed > 18 && now - lastTrailTime > 95) {
        lastTrailTime = now;
        trailCounter += 1;
        const newLeaf: TrailLeaf = {
          id: trailCounter,
          x: e.clientX,
          y: e.clientY,
          angle: Math.atan2(targetY - currentY, targetX - currentX) * (180 / Math.PI) + 45,
          scale: 0.55 + (trailCounter % 3) * 0.15,
        };
        setTrailLeaves((prev) => [...prev.slice(-7), newLeaf]);
      }
    };

    const animate = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * 0.22;
      currentY += dy * 0.22;

      if (Math.hypot(dx, dy) > 1.2) {
        const desiredAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 45;
        // Smooth angular interpolation
        let diff = desiredAngle - currentAngle;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        currentAngle += diff * 0.18;
      }

      if (leafCursorRef.current) {
        leafCursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentAngle}deg)`;
      }

      // Interactive Forest Canopy Parallax
      const normX = (currentX / Math.max(1, window.innerWidth) - 0.5) * 2;
      const normY = (currentY / Math.max(1, window.innerHeight) - 0.5) * 2;

      if (canopyLeftRef.current) {
        canopyLeftRef.current.style.transform = `translate3d(${normX * -18}px, ${
          normY * -12
        }px, 0) rotate(${normX * 2.5}deg)`;
      }
      if (canopyRightRef.current) {
        canopyRightRef.current.style.transform = `translate3d(${normX * 18}px, ${
          normY * -12
        }px, 0) rotate(${normX * -2.5}deg)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  return (
    <>
      {/* Interactive Forest Canopy Parallax Background Layer */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      >
        {/* Soft Sunlit Canopy Gradient Glow */}
        <div
          className="absolute -top-24 left-1/4 w-[620px] h-[420px] rounded-full opacity-35 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(182, 134, 44, 0.26) 0%, rgba(46, 111, 64, 0.08) 60%, transparent 100%)',
          }}
        />

        {/* Left Interactive Forest Branch Silhouette */}
        <svg
          ref={canopyLeftRef}
          viewBox="0 0 360 420"
          className="hidden md:block absolute -top-8 -left-10 w-[310px] h-[360px] text-[#1B432C]/[0.065] transition-transform duration-300 ease-out"
          fill="currentColor"
        >
          <path d="M0,0 L220,0 C190,65 140,120 75,155 C135,150 195,175 230,225 C155,235 90,210 35,175 C85,235 120,305 110,380 C55,335 20,275 0,210 Z" />
          <path d="M40,20 C110,40 165,85 190,145 C120,130 65,95 40,20 Z" />
        </svg>

        {/* Right Interactive Forest Branch Silhouette */}
        <svg
          ref={canopyRightRef}
          viewBox="0 0 360 420"
          className="hidden md:block absolute -top-8 -right-10 w-[310px] h-[360px] text-[#1B432C]/[0.065] transition-transform duration-300 ease-out"
          fill="currentColor"
        >
          <path d="M360,0 L140,0 C170,65 220,120 285,155 C225,150 165,175 130,225 C205,235 270,210 325,175 C275,235 240,305 250,380 C305,335 340,275 360,210 Z" />
          <path d="M320,20 C250,40 195,85 170,145 C240,130 295,95 320,20 Z" />
        </svg>
      </div>

      {/* Moving Botanical Leaf Cursor & Trailing Wake */}
      {enabled && (
        <div
          aria-hidden="true"
          className="hidden md:block fixed inset-0 pointer-events-none z-40 overflow-hidden"
        >
          {/* Subtle Trailing Wake Leaves */}
          {trailLeaves.map((tl) => (
            <div
              key={tl.id}
              style={{
                left: tl.x,
                top: tl.y,
                transform: `translate(-50%, -50%) rotate(${tl.angle}deg) scale(${tl.scale})`,
              }}
              className="absolute opacity-35 transition-opacity duration-500"
            >
              <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
                <path
                  d="M30 6C16 6 7 15 6 30C21 29 30 20 30 6Z"
                  fill="#B6862C"
                  fillOpacity="0.45"
                />
              </svg>
            </div>
          ))}

          {/* Primary Gliding Botanical Leaf Cursor */}
          <div
            ref={leafCursorRef}
            className="fixed top-0 left-0 -ml-3 -mt-3 pointer-events-none will-change-transform"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 38 38"
              fill="none"
              className="drop-shadow-[0_3px_6px_rgba(22,35,25,0.25)]"
            >
              {/* Botanical Leaf Blade */}
              <path
                d="M32 5C17 5 7 15 6 32C23 31 32 21 32 5Z"
                fill="#1B432C"
                fillOpacity="0.88"
                stroke="#B6862C"
                strokeWidth="1.5"
              />
              {/* Golden Midrib & Lateral Veins */}
              <path
                d="M4 34C12 25 22 15 32 5"
                stroke="#E7C675"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M14 24C14 19 17 15 21 14"
                stroke="#E7C675"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <path
                d="M19 19C24 19 27 16 28 13"
                stroke="#E7C675"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      )}
    </>
  );
};
