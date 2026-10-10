import React, { useRef, useState } from 'react';
import { Upload, Eye, EyeOff } from 'lucide-react';
import { HerbariumSpecimen } from '../data/herbariumData';

interface BotanicalSpecimenArtworkProps {
  specimen: HerbariumSpecimen;
  customImageUrl?: string;
  onUploadCustomImage: (specimenId: string, dataUrl: string) => void;
  showGeotagOverlay?: boolean;
  onToggleGeotagOverlay?: () => void;
}

export const BotanicalSpecimenArtwork: React.FC<BotanicalSpecimenArtworkProps> = ({
  specimen,
  customImageUrl,
  onUploadCustomImage,
  showGeotagOverlay = true,
  onToggleGeotagOverlay,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const activeImageSrc = customImageUrl || specimen.defaultImageUrl;

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUploadCustomImage(specimen.id, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      readFile(file);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`relative w-full aspect-[4/3] sm:aspect-[4/4.2] bg-[#1E2B22] rounded-xl overflow-hidden border transition-all group select-none ${
        isDragOver ? 'border-[#B6862C] ring-2 ring-[#B6862C]' : 'border-[#D6DFD0]'
      }`}
    >
      {/* Specimen Photograph */}
      <img
        src={activeImageSrc}
        alt={`${specimen.commonName} (${specimen.taxonomy.scientificName}) — ${specimen.geotag.address}`}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />

      {/* File Name & Photo Controls */}
      <div
        className={`absolute ${
          specimen.geotag.overlayPosition === 'top' ? 'bottom-3' : 'top-3'
        } right-3 z-20 flex items-center gap-1.5`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label={`Select photo for ${specimen.commonName}`}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="px-2.5 py-1.5 text-[11px] font-medium bg-black/75 hover:bg-black/90 text-white rounded-md backdrop-blur-sm flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          title={`Replace photo (${specimen.fileName})`}
        >
          <Upload className="w-3 h-3" />
          <span>{specimen.fileName}</span>
        </button>

        {onToggleGeotagOverlay && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleGeotagOverlay();
            }}
            className="p-1.5 bg-black/75 hover:bg-black/90 text-white rounded-md backdrop-blur-sm transition-colors cursor-pointer"
            title={showGeotagOverlay ? 'Hide GPS Map Camera overlay' : 'Show GPS Map Camera overlay'}
            aria-label={showGeotagOverlay ? 'Hide GPS Map Camera overlay' : 'Show GPS Map Camera overlay'}
          >
            {showGeotagOverlay ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* GPS Map Camera Geotag Overlay matching the Indore photos */}
      {showGeotagOverlay && (
        <div
          className={`absolute left-2.5 right-2.5 z-10 ${
            specimen.geotag.overlayPosition === 'top' ? 'top-2.5' : 'bottom-2.5'
          } flex items-stretch gap-2 pointer-events-none`}
        >
          {/* Left Google Satellite Mini-Map Square with Red Pin */}
          <div className="w-[76px] sm:w-[88px] shrink-0 rounded-md overflow-hidden border border-white/25 bg-[#3D3934] relative flex flex-col justify-between p-1.5 shadow-md">
            <svg
              viewBox="0 0 80 80"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            >
              <rect width="80" height="80" fill="#595045" />
              <rect x="4" y="4" width="22" height="16" fill="#7D7265" />
              <rect x="30" y="4" width="18" height="20" fill="#6E6357" />
              <rect x="52" y="6" width="24" height="15" fill="#877B6E" />
              <rect x="6" y="26" width="20" height="24" fill="#6B6156" />
              <rect x="32" y="28" width="22" height="18" fill="#827668" />
              <rect x="58" y="26" width="18" height="24" fill="#695E52" />
              <rect x="6" y="54" width="24" height="20" fill="#7A6E60" />
              <rect x="34" y="52" width="20" height="22" fill="#6E6357" />
              <rect x="58" y="54" width="18" height="20" fill="#827668" />
              <circle cx="24" cy="18" r="6" fill="#2D5A27" />
              <circle cx="54" cy="48" r="5" fill="#2D5A27" />
              <path d="M28,0 L28,80 M55,0 L55,80 M0,24 L80,24 M0,50 L80,50" stroke="#423B32" strokeWidth="2" />
              <polygon points="40,38 56,56 34,60" fill="rgba(59, 130, 246, 0.45)" />
            </svg>

            <div className="relative z-10 m-auto flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-[#EA4335] border-2 border-white shadow flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#801D15]" />
              </div>
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-[#EA4335] -mt-0.5" />
            </div>

            <div className="relative z-10 text-[11px] font-bold text-white tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] text-center leading-none">
              Google
            </div>
          </div>

          {/* Right GPS Map Camera Telemetry Box */}
          <div className="flex-1 min-w-0 bg-black/72 backdrop-blur-md text-white rounded-md px-2.5 py-2 border border-white/15 shadow-md flex flex-col justify-between relative">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs sm:text-[13px] font-semibold tracking-tight text-white truncate">
                {specimen.geotag.locationTitle} 🇮🇳
              </p>
              <span className="hidden sm:inline-flex items-center gap-1 text-[9px] text-white/85 bg-black/50 px-1.5 py-0.5 rounded shrink-0">
                <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
                GPS Map Camera
              </span>
            </div>

            <p className="text-[10px] sm:text-[11px] text-white/90 leading-snug line-clamp-2 mt-0.5">
              {specimen.geotag.address}
            </p>

            <div className="mt-1 space-y-0.5 font-mono-tabular text-[10px] sm:text-[10.5px] text-white/95 leading-tight">
              <div>
                Lat {specimen.geotag.latDisplay} Long {specimen.geotag.lngDisplay}
              </div>
              <div className="text-white/80">{specimen.geotag.timestamp}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
