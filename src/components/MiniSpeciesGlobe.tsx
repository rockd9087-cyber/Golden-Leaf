import React, { useEffect, useRef, useState } from 'react';
import { Globe, MapPin, RotateCcw, Compass } from 'lucide-react';
import { NativeOriginData, GeotagData } from '../data/herbariumData';

interface MiniSpeciesGlobeProps {
  commonName: string;
  scientificName: string;
  nativeOrigin: NativeOriginData;
  geotag: GeotagData;
  accentColor?: string;
  size?: 'compact' | 'large';
}

// Simplified continental polygons [lat, lng] for crisp orthographic 3D globe rendering
const CONTINENT_POLYGONS: Array<{ name: string; points: Array<[number, number]> }> = [
  {
    name: 'North America',
    points: [
      [70, -160], [72, -130], [65, -90], [60, -65], [45, -60], [38, -75],
      [25, -80], [20, -87], [15, -85], [9, -79], [16, -95], [23, -106],
      [32, -117], [48, -124], [60, -140], [65, -165],
    ],
  },
  {
    name: 'South America',
    points: [
      [11, -75], [10, -62], [5, -52], [0, -50], [-6, -35], [-15, -39],
      [-23, -43], [-35, -53], [-54, -68], [-50, -75], [-33, -72], [-18, -71],
      [-5, -81], [4, -77],
    ],
  },
  {
    name: 'Europe',
    points: [
      [36, -9], [43, -9], [48, -4], [54, 8], [60, 5], [70, 20],
      [70, 40], [60, 60], [46, 48], [42, 28], [38, 24], [40, 15],
      [43, 3], [36, -5],
    ],
  },
  {
    name: 'Africa',
    points: [
      [36, -6], [37, 10], [32, 32], [20, 38], [12, 51], [2, 45],
      [-10, 40], [-25, 33], [-34, 18], [-22, 14], [-5, 12], [5, 2],
      [5, -8], [15, -17], [28, -13],
    ],
  },
  {
    name: 'Asia & India',
    points: [
      [60, 60], [72, 80], [72, 130], [65, 170], [52, 140], [40, 140],
      [35, 130], [22, 120], [10, 105], [1, 104], [15, 98], [22, 89],
      [8, 77], [22, 69], [25, 62], [13, 45], [28, 34], [37, 36],
      [42, 44], [46, 50],
    ],
  },
  {
    name: 'Australia',
    points: [
      [-12, 131], [-12, 142], [-20, 149], [-28, 153], [-38, 147],
      [-35, 136], [-34, 115], [-22, 114], [-15, 124],
    ],
  },
  {
    name: 'Japan',
    points: [
      [44, 141], [39, 142], [34, 136], [31, 130], [36, 136], [41, 140],
    ],
  },
  {
    name: 'Madagascar',
    points: [
      [-13, 49], [-25, 47], [-25, 44], [-15, 46],
    ],
  },
];

const DEG_TO_RAD = Math.PI / 180;

function projectOrthographic(
  lat: number,
  lng: number,
  centerLat: number,
  centerLng: number,
  radius: number,
  cx: number,
  cy: number
): { x: number; y: number; visible: boolean; z: number } {
  const phi = lat * DEG_TO_RAD;
  const lambda = lng * DEG_TO_RAD;
  const phi0 = centerLat * DEG_TO_RAD;
  const lambda0 = centerLng * DEG_TO_RAD;

  const dLambda = lambda - lambda0;
  const cosC =
    Math.sin(phi0) * Math.sin(phi) +
    Math.cos(phi0) * Math.cos(phi) * Math.cos(dLambda);

  const x = cx + radius * Math.cos(phi) * Math.sin(dLambda);
  const y =
    cy -
    radius *
      (Math.cos(phi0) * Math.sin(phi) -
        Math.sin(phi0) * Math.cos(phi) * Math.cos(dLambda));

  return { x, y, visible: cosC >= 0, z: cosC };
}

export const MiniSpeciesGlobe: React.FC<MiniSpeciesGlobeProps> = ({
  commonName,
  nativeOrigin,
  geotag,
  accentColor = '#1B432C',
  size = 'compact',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [focusMode, setFocusMode] = useState<'origin' | 'indore'>('origin');
  const [isDragging, setIsDragging] = useState(false);

  // Target rotation centers initially on the plant's native origin
  const rotationRef = useRef({
    lat: nativeOrigin.lat * 0.65,
    lng: nativeOrigin.lng,
    targetLat: nativeOrigin.lat * 0.65,
    targetLng: nativeOrigin.lng,
    dragStartX: 0,
    dragStartY: 0,
    dragStartLat: 0,
    dragStartLng: 0,
    pulsePhase: 0,
  });

  useEffect(() => {
    rotationRef.current.targetLat = nativeOrigin.lat * 0.65;
    rotationRef.current.targetLng = nativeOrigin.lng;
    setFocusMode('origin');
  }, [nativeOrigin.lat, nativeOrigin.lng]);

  const handleFocusOrigin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusMode('origin');
    rotationRef.current.targetLat = nativeOrigin.lat * 0.65;
    rotationRef.current.targetLng = nativeOrigin.lng;
  };

  const handleFocusIndore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusMode('indore');
    rotationRef.current.targetLat = geotag.lat * 0.7;
    rotationRef.current.targetLng = geotag.lng;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dim = size === 'large' ? 280 : 148;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = dim * dpr;
    canvas.height = dim * dpr;

    const render = () => {
      const rState = rotationRef.current;
      rState.pulsePhase += 0.045;

      if (!isDragging) {
        // Subtle drift around target longitude so the globe feels alive
        const driftLng =
          rState.targetLng + Math.sin(rState.pulsePhase * 0.35) * 6;
        rState.lng += (driftLng - rState.lng) * 0.08;
        rState.lat += (rState.targetLat - rState.lat) * 0.08;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, dim, dim);

      const cx = dim / 2;
      const cy = dim / 2;
      const radius = dim * 0.43;

      // 1. Soft botanical ocean sphere gradient
      const oceanGrad = ctx.createRadialGradient(
        cx - radius * 0.28,
        cy - radius * 0.28,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      oceanGrad.addColorStop(0, '#F3F7F0');
      oceanGrad.addColorStop(0.65, '#DFEAE0');
      oceanGrad.addColorStop(1, '#C5D6C8');

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = oceanGrad;
      ctx.fill();

      // Clip inside globe sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      // 2. Graticule lines (Lat/Lng grid)
      ctx.strokeStyle = 'rgba(27, 67, 44, 0.11)';
      ctx.lineWidth = 0.7;

      // Parallels (latitudes)
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lng = -180; lng <= 180; lng += 6) {
          const p = projectOrthographic(lat, lng, rState.lat, rState.lng, radius, cx, cy);
          if (p.visible) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // Meridians (longitudes)
      for (let lng = -150; lng <= 180; lng += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -80; lat <= 80; lat += 6) {
          const p = projectOrthographic(lat, lng, rState.lat, rState.lng, radius, cx, cy);
          if (p.visible) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // 3. Continents in soft botanical sage-olive
      for (const continent of CONTINENT_POLYGONS) {
        ctx.beginPath();
        let visibleCount = 0;
        continent.points.forEach(([lat, lng], idx) => {
          const p = projectOrthographic(lat, lng, rState.lat, rState.lng, radius, cx, cy);
          if (p.visible) visibleCount++;
          if (idx === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        });
        ctx.closePath();
        if (visibleCount > 1) {
          ctx.fillStyle = 'rgba(72, 114, 82, 0.34)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(27, 67, 44, 0.45)';
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }

      // 4. Native Region Biogeographic Range Halo
      const originProj = projectOrthographic(
        nativeOrigin.lat,
        nativeOrigin.lng,
        rState.lat,
        rState.lng,
        radius,
        cx,
        cy
      );

      if (originProj.visible) {
        const rangePx = Math.max(
          12,
          (nativeOrigin.rangeRadiusDeg / 90) * radius * (0.65 + 0.35 * originProj.z)
        );
        const pulseScale = 1 + 0.18 * Math.sin(rState.pulsePhase);

        // Soft native range zone fill
        const rangeGrad = ctx.createRadialGradient(
          originProj.x,
          originProj.y,
          2,
          originProj.x,
          originProj.y,
          rangePx * pulseScale
        );
        rangeGrad.addColorStop(0, `${accentColor}66`);
        rangeGrad.addColorStop(0.65, `${accentColor}28`);
        rangeGrad.addColorStop(1, `${accentColor}00`);

        ctx.beginPath();
        ctx.arc(originProj.x, originProj.y, rangePx * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = rangeGrad;
        ctx.fill();

        // Dashed native habitat boundary ring
        ctx.save();
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.arc(originProj.x, originProj.y, rangePx * 0.82, 0, Math.PI * 2);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // 5. Geodesic Arc connecting Native Origin -> Indore Collection Site
      const indoreProj = projectOrthographic(
        geotag.lat,
        geotag.lng,
        rState.lat,
        rState.lng,
        radius,
        cx,
        cy
      );

      if (originProj.visible || indoreProj.visible) {
        ctx.save();
        ctx.beginPath();
        const steps = 24;
        let pathStarted = false;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const interpLat = nativeOrigin.lat + (geotag.lat - nativeOrigin.lat) * t;
          const interpLng = nativeOrigin.lng + (geotag.lng - nativeOrigin.lng) * t;
          const pt = projectOrthographic(
            interpLat,
            interpLng,
            rState.lat,
            rState.lng,
            radius,
            cx,
            cy
          );
          if (pt.visible) {
            if (!pathStarted) {
              ctx.moveTo(pt.x, pt.y);
              pathStarted = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        }
        ctx.strokeStyle = 'rgba(182, 134, 44, 0.78)';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.restore();
      }

      // 6. Native Origin Pin (Primary Emerald Pin)
      if (originProj.visible) {
        ctx.beginPath();
        ctx.arc(originProj.x, originProj.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.fill();
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = '#FCFBF7';
        ctx.stroke();
      }

      // 7. Indore Collection Pin (Golden Ochre Pin)
      if (indoreProj.visible) {
        ctx.beginPath();
        ctx.arc(indoreProj.x, indoreProj.y, 3.8, 0, Math.PI * 2);
        ctx.fillStyle = '#B6862C';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#FCFBF7';
        ctx.stroke();
      }

      ctx.restore(); // End globe clip

      // 8. Outer rim border
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(27, 67, 44, 0.28)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [nativeOrigin, geotag, accentColor, size, isDragging]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    rotationRef.current.dragStartX = e.clientX;
    rotationRef.current.dragStartY = e.clientY;
    rotationRef.current.dragStartLat = rotationRef.current.lat;
    rotationRef.current.dragStartLng = rotationRef.current.lng;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - rotationRef.current.dragStartX;
    const dy = e.clientY - rotationRef.current.dragStartY;
    const nextLng = rotationRef.current.dragStartLng - dx * 0.65;
    const nextLat = Math.max(
      -70,
      Math.min(70, rotationRef.current.dragStartLat + dy * 0.65)
    );
    rotationRef.current.lng = nextLng;
    rotationRef.current.lat = nextLat;
    rotationRef.current.targetLng = nextLng;
    rotationRef.current.targetLat = nextLat;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const formatCoord = (lat: number, lng: number) => {
    const ns = lat >= 0 ? 'N' : 'S';
    const ew = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(2)}° ${ns}, ${Math.abs(lng).toFixed(2)}° ${ew}`;
  };

  return (
    <div className="bg-[#F6F4EC] border border-[#D6DFD0] rounded-xl p-3.5 transition-colors">
      <div className="flex flex-col sm:flex-row items-center gap-3.5">
        {/* Interactive 3D Canvas Globe */}
        <div className="relative shrink-0 flex flex-col items-center">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            title={`Drag to rotate 3D globe for ${commonName}`}
            aria-label={`Interactive 3D globe showing native geographical origin of ${commonName} in ${nativeOrigin.regionName}`}
            className={`${
              size === 'large' ? 'w-[220px] h-[220px]' : 'w-[132px] h-[132px]'
            } cursor-grab active:cursor-grabbing select-none touch-none rounded-full`}
          />
          <span className="mt-1 text-[11px] text-[#465749] flex items-center gap-1 select-none">
            <Compass className="w-3 h-3 text-[#1B432C]" />
            Drag globe to rotate
          </span>
        </div>

        {/* Geographical Origin & Indore Field Coordinates */}
        <div className="flex-1 min-w-0 w-full space-y-2.5">
          <div className="flex items-center justify-between gap-2 border-b border-[#D6DFD0] pb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#162319]">
              <Globe className="w-3.5 h-3.5 text-[#1B432C] shrink-0" />
              <span>Biogeographical Origin</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleFocusOrigin}
                className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  focusMode === 'origin'
                    ? 'bg-[#1B432C] text-white'
                    : 'bg-[#EBF0E8] text-[#162319] hover:bg-[#D6DFD0]'
                }`}
              >
                Native Range
              </button>
              <button
                type="button"
                onClick={handleFocusIndore}
                className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  focusMode === 'indore'
                    ? 'bg-[#B6862C] text-white'
                    : 'bg-[#EBF0E8] text-[#162319] hover:bg-[#D6DFD0]'
                }`}
              >
                Indore Site
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-[#465749]">
              <span className="font-semibold text-[#162319]">Native Region: </span>
              <span>{nativeOrigin.regionName}</span>
              <span aria-hidden="true"> · </span>
              <span className="font-mono-tabular text-[11px]">
                {formatCoord(nativeOrigin.lat, nativeOrigin.lng)}
              </span>
            </div>
            <div className="text-xs text-[#465749]">
              <span className="font-semibold text-[#162319]">Biome: </span>
              <span>{nativeOrigin.climateZone}</span>
            </div>
            <p className="text-xs text-[#465749] leading-relaxed">
              {nativeOrigin.biogeographySummary}
            </p>
          </div>

          {/* Legend & Field Site Link */}
          <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#465749] border-t border-[#D6DFD0]/70">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#1B432C]" />
              <span>Origin: {nativeOrigin.continent}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <RotateCcw className="w-3 h-3 text-[#B6862C]" />
              <span className="font-mono-tabular">
                Collected: Indore ({geotag.latDisplay} N, {geotag.lngDisplay} E)
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
