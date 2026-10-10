import React, { useEffect, useRef, useState } from 'react';
import { HERBARIUM_SPECIMENS } from '../data/herbariumData';

interface InteractiveForestAndCursorProps {
  enabled: boolean;
}

type LeafSpeciesId =
  | 'inch-plant'
  | 'hadjod'
  | 'indian-almond'
  | 'bridal-bouquet'
  | 'thuja'
  | 'buddhist-pine'
  | 'silver-wattle'
  | 'half-flower'
  | 'rose-of-sharon'
  | 'spider-plant'
  | 'golden-leaf';

interface TrailLeaf {
  id: number;
  speciesId: LeafSpeciesId;
  x: number;
  y: number;
  angle: number;
  scale: number;
}

interface BackgroundFallingLeaf {
  id: number;
  speciesId: LeafSpeciesId;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmplitude: number;
  scale: number;
  opacity: number;
  layer: 'front' | 'back';
}

const SPECIES_LABELS: Record<LeafSpeciesId, string> = {
  'inch-plant': 'Inch Plant (Tradescantia zebrina)',
  hadjod: 'Hadjod (Cissus quadrangularis)',
  'indian-almond': 'Indian Almond (Terminalia catappa)',
  'bridal-bouquet': 'Bridal Bouquet (Plumeria pudica)',
  thuja: 'Thuja (Platycladus orientalis)',
  'buddhist-pine': 'Buddhist Pine (Podocarpus macrophyllus)',
  'silver-wattle': 'Silver Wattle (Acacia dealbata)',
  'half-flower': 'Half Flower (Scaevola taccada)',
  'rose-of-sharon': 'Rose of Sharon (Hibiscus syriacus)',
  'spider-plant': 'Spider Plant (Chlorophytum comosum)',
  'golden-leaf': 'Golden Leaf Canopy',
};

/**
 * Renders an authentic botanical SVG leaf matching each named plant entry
 */
export function renderSpeciesLeafSVG(speciesId: LeafSpeciesId, size = 28) {
  switch (speciesId) {
    case 'inch-plant':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <path d="M20 3C10 9 7 22 20 37C33 22 30 9 20 3Z" fill="#5E2750" />
          <path
            d="M20 4.5C11.5 10 9 21.5 20 35.5C31 21.5 28.5 10 20 4.5Z"
            fill="#1F6E43"
          />
          <path
            d="M20 6C14 11 12.5 21 20 33"
            stroke="#E5EFE9"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M20 6C26 11 27.5 21 20 33"
            stroke="#E5EFE9"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <line x1="20" y1="5" x2="20" y2="35" stroke="#13472B" strokeWidth="1.2" />
        </svg>
      );

    case 'hadjod':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <rect
            x="18"
            y="29"
            width="4"
            height="9"
            rx="1"
            fill="#5D9636"
            stroke="#365E1D"
            strokeWidth="1"
          />
          <path
            d="M20 5C15 5 13 9 9 11C5 13 5 19 9 23C12 26 16 28 20 29C24 28 28 26 31 23C35 19 35 13 31 11C27 9 25 5 20 5Z"
            fill="#68A83C"
            stroke="#335C18"
            strokeWidth="1.3"
          />
          <path
            d="M20 29L20 9M20 21L11 15M20 21L29 15"
            stroke="#B7E38E"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'indian-almond':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <path
            d="M20 4C9 4 6 14 10 24C13 30 17 34 20 36C23 34 27 30 30 24C34 14 31 4 20 4Z"
            fill="#569625"
            stroke="#2D5710"
            strokeWidth="1.3"
          />
          <path d="M20 37L20 6" stroke="#DAF584" strokeWidth="1.6" strokeLinecap="round" />
          <path
            d="M20 13L12 10M20 13L28 10M20 19L11 16M20 19L29 16M20 25L13 22M20 25L27 22"
            stroke="#CBEB6A"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'bridal-bouquet':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <path
            d="M20 3C13 7 11 12 15 18C16 22 17 29 20 37C23 29 24 22 25 18C29 12 27 7 20 3Z"
            fill="#275834"
            stroke="#15361E"
            strokeWidth="1.3"
          />
          <path d="M20 37L20 5" stroke="#A7D9A2" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'thuja':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <g stroke="#3E7C47" strokeWidth="2.4" strokeLinecap="round">
            <path d="M20 36L20 5" />
            <path d="M20 29L11 21M20 29L29 21" />
            <path d="M20 22L10 13M20 22L30 13" />
            <path d="M20 15L13 8M20 15L27 8" />
          </g>
          <g stroke="#78B872" strokeWidth="1.1" strokeLinecap="round" strokeDasharray="2 2">
            <path d="M20 34L20 6" />
            <path d="M20 29L11 21M20 29L29 21" />
            <path d="M20 22L10 13M20 22L30 13" />
          </g>
        </svg>
      );

    case 'buddhist-pine':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <path
            d="M20 2C15 11 15 26 20 38C25 26 25 11 20 2Z"
            fill="#669E2E"
            stroke="#385E14"
            strokeWidth="1.2"
          />
          <line x1="20" y1="4" x2="20" y2="37" stroke="#D2F086" strokeWidth="1.2" />
        </svg>
      );

    case 'silver-wattle':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <line
            x1="20"
            y1="36"
            x2="20"
            y2="4"
            stroke="#538568"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {[8, 13, 18, 23, 28, 32].map((y, idx) => {
            const spread = idx === 0 || idx === 5 ? 7 : 11;
            return (
              <g key={y}>
                <line
                  x1="20"
                  y1={y}
                  x2={20 - spread}
                  y2={y - 3}
                  stroke="#6BA383"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="1.5 1.5"
                />
                <line
                  x1="20"
                  y1={y}
                  x2={20 + spread}
                  y2={y - 3}
                  stroke="#6BA383"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="1.5 1.5"
                />
              </g>
            );
          })}
        </svg>
      );

    case 'half-flower':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <path
            d="M20 5C10 5 9 16 14 26C16 31 18 35 20 37C22 35 24 31 26 26C31 16 30 5 20 5Z"
            fill="#478C43"
            stroke="#225220"
            strokeWidth="1.3"
          />
          <path d="M20 36L20 8" stroke="#BBE8A9" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="16" cy="13" rx="2.5" ry="4.5" fill="#8CD17D" fillOpacity="0.4" />
        </svg>
      );

    case 'rose-of-sharon':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <path
            d="M20 3L24 9L28 8L27 14L34 13L31 19L33 23L26 26L25 30L20 35L15 30L14 26L7 23L9 19L6 13L13 14L12 8L16 9L20 3Z"
            fill="#2E6B38"
            stroke="#173D1D"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M20 35L20 6M20 26L10 16M20 26L30 16"
            stroke="#9AD18B"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'spider-plant':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <path
            d="M8 35C11 20 20 9 34 4C27 16 20 27 14 37Z"
            fill="#3B8228"
            stroke="#235416"
            strokeWidth="1.1"
          />
          <path
            d="M11 36C15 22 22 12 33 5"
            stroke="#F2F094"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
          <path
            d="M32 5C17 5 7 15 6 32C23 31 32 21 32 5Z"
            fill="#1B432C"
            fillOpacity="0.88"
            stroke="#B6862C"
            strokeWidth="1.5"
          />
          <path
            d="M4 34C12 25 22 15 32 5"
            stroke="#E7C675"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M14 24C14 19 17 15 21 14M19 19C24 19 27 16 28 13"
            stroke="#E7C675"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

export const InteractiveForestAndCursor: React.FC<InteractiveForestAndCursorProps> = ({
  enabled,
}) => {
  const leafCursorRef = useRef<HTMLDivElement | null>(null);
  const canopyLeftRef = useRef<SVGSVGElement | null>(null);
  const canopyRightRef = useRef<SVGSVGElement | null>(null);

  const [activeSpeciesId, setActiveSpeciesId] = useState<LeafSpeciesId>('inch-plant');
  const activeSpeciesRef = useRef<LeafSpeciesId>('inch-plant');

  // Subtle cursor wake (just like before: up to 5 gentle wake leaves)
  const [trailLeaves, setTrailLeaves] = useState<TrailLeaf[]>([]);

  // Sparse, slow-falling background leaves matching the current section's plant
  const [bgLeaves, setBgLeaves] = useState<BackgroundFallingLeaf[]>([]);
  const bgLeavesRef = useRef<BackgroundFallingLeaf[]>([]);
  const nextIdRef = useRef<number>(1);

  useEffect(() => {
    activeSpeciesRef.current = activeSpeciesId;
  }, [activeSpeciesId]);

  // Detect which plant specimen section is in view and gently transition the background leaves
  useEffect(() => {
    const validIds = new Set<string>(HERBARIUM_SPECIMENS.map((s) => s.id));

    const spawnGentleSectionLeaves = (speciesId: LeafSpeciesId) => {
      const w = window.innerWidth;
      const newLeaves: BackgroundFallingLeaf[] = Array.from({ length: 4 }).map((_, i) => {
        const isFront = i % 2 === 0;
        return {
          id: nextIdRef.current++,
          speciesId,
          x: w * (0.15 + i * 0.22) + (Math.random() - 0.5) * 120,
          y: -25 - i * 35,
          vx: (Math.random() - 0.5) * 0.35,
          vy: 1.45 + Math.random() * 0.8,
          angle: Math.random() * 360,
          angularVelocity: (Math.random() - 0.5) * 1.4,
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.028 + Math.random() * 0.018,
          swayAmplitude: 0.65 + Math.random() * 0.45,
          scale: isFront ? 0.8 + Math.random() * 0.25 : 0.7 + Math.random() * 0.2,
          opacity: isFront ? 0.55 + Math.random() * 0.2 : 0.35 + Math.random() * 0.15,
          layer: isFront ? 'front' : 'back',
        };
      });
      bgLeavesRef.current = [...bgLeavesRef.current.slice(-6), ...newLeaves];
    };

    const handleScrollDetection = () => {
      const viewportCenterY = window.innerHeight * 0.45;
      let closestId: LeafSpeciesId | null = null;
      let closestDist = Infinity;

      for (const sp of HERBARIUM_SPECIMENS) {
        const el = document.getElementById(`specimen-${sp.id}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportCenterY && rect.bottom >= viewportCenterY) {
          closestId = sp.id as LeafSpeciesId;
          closestDist = 0;
          break;
        }
        const center = (rect.top + rect.bottom) / 2;
        const dist = Math.abs(center - viewportCenterY);
        if (dist < closestDist && dist < window.innerHeight * 0.65) {
          closestDist = dist;
          closestId = sp.id as LeafSpeciesId;
        }
      }

      const nextSpecies: LeafSpeciesId = closestId || 'golden-leaf';
      if (nextSpecies !== activeSpeciesRef.current) {
        activeSpeciesRef.current = nextSpecies;
        setActiveSpeciesId(nextSpecies);
        if (enabled && validIds.has(nextSpecies)) {
          spawnGentleSectionLeaves(nextSpecies);
        }
      }
    };

    window.addEventListener('scroll', handleScrollDetection, { passive: true });
    handleScrollDetection();

    return () => {
      window.removeEventListener('scroll', handleScrollDetection);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      bgLeavesRef.current = [];
      setBgLeaves([]);
      setTrailLeaves([]);
      return;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let currentAngle = -35;
    let lastTrailTime = 0;
    let trailCounter = 0;
    let lastBgSpawnTime = performance.now();
    let frameCount = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      const hoveredArticle = (e.target as HTMLElement | null)?.closest?.(
        'article[id^="specimen-"]'
      );
      if (hoveredArticle) {
        const spId = hoveredArticle.id.replace('specimen-', '') as LeafSpeciesId;
        if (spId && spId !== activeSpeciesRef.current) {
          activeSpeciesRef.current = spId;
          setActiveSpeciesId(spId);
        }
      }

      // Subtle cursor wake just like before (max 5 small wake leaves when moving fast)
      const now = performance.now();
      const speed = Math.hypot(targetX - currentX, targetY - currentY);
      if (speed > 22 && now - lastTrailTime > 125) {
        lastTrailTime = now;
        trailCounter += 1;
        const newLeaf: TrailLeaf = {
          id: trailCounter,
          speciesId: activeSpeciesRef.current,
          x: e.clientX,
          y: e.clientY,
          angle: Math.atan2(targetY - currentY, targetX - currentX) * (180 / Math.PI) + 45,
          scale: 0.5 + (trailCounter % 3) * 0.12,
        };
        setTrailLeaves((prev) => [...prev.slice(-5), newLeaf]);
      }
    };

    const animate = (now: number) => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * 0.22;
      currentY += dy * 0.22;

      if (Math.hypot(dx, dy) > 1.2) {
        const desiredAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 45;
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

      // Spawn a falling leaf every ~1.2 seconds (max 9 on screen total, alternating front & back)
      if (now - lastBgSpawnTime > 1200 && bgLeavesRef.current.length < 9) {
        lastBgSpawnTime = now;
        const nextId = nextIdRef.current++;
        const isFront = nextId % 2 === 0;
        bgLeavesRef.current.push({
          id: nextId,
          speciesId: activeSpeciesRef.current,
          x: Math.random() * window.innerWidth,
          y: -30,
          vx: (Math.random() - 0.5) * 0.35,
          vy: 1.4 + Math.random() * 0.8,
          angle: Math.random() * 360,
          angularVelocity: (Math.random() - 0.5) * 1.35,
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.026 + Math.random() * 0.018,
          swayAmplitude: 0.6 + Math.random() * 0.45,
          scale: isFront ? 0.78 + Math.random() * 0.28 : 0.68 + Math.random() * 0.22,
          opacity: isFront ? 0.55 + Math.random() * 0.2 : 0.32 + Math.random() * 0.16,
          layer: isFront ? 'front' : 'back',
        });
      }

      // Update slow-falling background leaves
      if (bgLeavesRef.current.length > 0) {
        const vh = window.innerHeight + 45;
        const updated: BackgroundFallingLeaf[] = [];

        for (const leaf of bgLeavesRef.current) {
          const nextY = leaf.y + leaf.vy;
          if (nextY > vh) continue;

          const nextPhase = leaf.swayPhase + leaf.swaySpeed;
          const nextX = leaf.x + leaf.vx + Math.sin(nextPhase) * leaf.swayAmplitude;
          const nextAngle = leaf.angle + leaf.angularVelocity + Math.cos(nextPhase) * 0.25;

          updated.push({
            ...leaf,
            x: nextX,
            y: nextY,
            angle: nextAngle,
            swayPhase: nextPhase,
          });
        }

        bgLeavesRef.current = updated;
        frameCount++;
        if (frameCount % 2 === 0) {
          setBgLeaves([...updated]);
        }
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
      {/* Background Layer (z-0): Forest Canopy Parallax + Slow-Falling Section-Matched Leaves */}
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

        {/* Background Falling Leaves (layer === 'back') */}
        {enabled &&
          bgLeaves
            .filter((leaf) => leaf.layer === 'back')
            .map((leaf) => (
              <div
                key={leaf.id}
                style={{
                  transform: `translate3d(${leaf.x}px, ${leaf.y}px, 0) rotate(${leaf.angle}deg) scale(${leaf.scale})`,
                  opacity: leaf.opacity,
                }}
                className="absolute top-0 left-0 -ml-3.5 -mt-3.5 will-change-transform"
              >
                {renderSpeciesLeafSVG(leaf.speciesId, 26)}
              </div>
            ))}
      </div>

      {/* Foreground Layer (z-40): Front Falling Leaves + Subtle Cursor Wake & Gliding Leaf Cursor */}
      {enabled && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-40 overflow-hidden select-none"
        >
          {/* Front Falling Leaves (layer === 'front') */}
          {bgLeaves
            .filter((leaf) => leaf.layer === 'front')
            .map((leaf) => (
              <div
                key={leaf.id}
                style={{
                  transform: `translate3d(${leaf.x}px, ${leaf.y}px, 0) rotate(${leaf.angle}deg) scale(${leaf.scale})`,
                  opacity: leaf.opacity,
                }}
                className="absolute top-0 left-0 -ml-3.5 -mt-3.5 will-change-transform drop-shadow-[0_2px_4px_rgba(22,35,25,0.12)]"
              >
                {renderSpeciesLeafSVG(leaf.speciesId, 30)}
              </div>
            ))}

          {/* Active Section Leaf Indicator Badge (Bottom-Left) */}
          <div className="hidden md:flex fixed bottom-3 left-3 z-40 items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FCFBF7]/85 backdrop-blur-md border border-[#D6DFD0] shadow-xs text-[11px] text-[#465749]">
            <span className="shrink-0">{renderSpeciesLeafSVG(activeSpeciesId, 16)}</span>
            <span>
              Section Leaf:{' '}
              <strong className="text-[#162319]">{SPECIES_LABELS[activeSpeciesId]}</strong>
            </span>
          </div>

          {/* Subtle Trailing Wake Leaves (just like before) */}
          {trailLeaves.map((tl) => (
            <div
              key={tl.id}
              style={{
                left: tl.x,
                top: tl.y,
                transform: `translate(-50%, -50%) rotate(${tl.angle}deg) scale(${tl.scale})`,
              }}
              className="absolute opacity-30 transition-opacity duration-500"
            >
              {renderSpeciesLeafSVG(tl.speciesId, 20)}
            </div>
          ))}

          {/* Primary Gliding Botanical Leaf Cursor */}
          <div
            ref={leafCursorRef}
            className="fixed top-0 left-0 -ml-3.5 -mt-3.5 pointer-events-none will-change-transform drop-shadow-[0_3px_6px_rgba(22,35,25,0.25)]"
          >
            {renderSpeciesLeafSVG(activeSpeciesId, 30)}
          </div>
        </div>
      )}
    </>
  );
};
