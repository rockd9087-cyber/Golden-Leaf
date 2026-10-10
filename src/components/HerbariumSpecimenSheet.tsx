import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, MapPin, Leaf, Compass } from 'lucide-react';
import { HerbariumSpecimen } from '../data/herbariumData';
import { BotanicalSpecimenArtwork } from './BotanicalSpecimenArtwork';
import { MiniSpeciesGlobe } from './MiniSpeciesGlobe';

interface HerbariumSpecimenSheetProps {
  specimen: HerbariumSpecimen;
  customImageUrl?: string;
  onUploadCustomImage: (specimenId: string, dataUrl: string) => void;
  showGeotagOverlay: boolean;
  onToggleGeotagOverlay: () => void;
}

export const HerbariumSpecimenSheet: React.FC<HerbariumSpecimenSheetProps> = ({
  specimen,
  customImageUrl,
  onUploadCustomImage,
  showGeotagOverlay,
  onToggleGeotagOverlay,
}) => {
  const [openDropdown, setOpenDropdown] = useState<'morphology' | 'geotag' | null>(null);

  const toggleDropdown = (section: 'morphology' | 'geotag') => {
    setOpenDropdown((prev) => (prev === section ? null : section));
  };

  return (
    <motion.article
      id={`specimen-${specimen.id}`}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-[#FCFBF7] border border-[#D6DFD0] hover:border-[#1B432C] rounded-2xl p-5 sm:p-7 transition-all duration-200 shadow-[0_2px_10px_rgba(22,35,25,0.03)] hover:shadow-[0_10px_28px_rgba(22,35,25,0.08)]"
    >
      {/* Top Specimen Sheet Header: File Name as Plant Common Name Heading */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-[#D6DFD0]">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#465749]">
            <span className="font-mono-tabular font-semibold text-[#1B432C]">
              HERBARIUM SHEET #{specimen.entryNumber}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">{specimen.fileName}</span>
            <span aria-hidden="true">·</span>
            <span>{specimen.useCategory}</span>
          </div>

          {/* Primary Heading matches Plant Common Name (from file name) */}
          <h3 className="mt-1 text-2xl sm:text-3xl font-serif-display font-bold text-[#162319] tracking-tight group-hover:text-[#1B432C] transition-colors">
            {specimen.entryNumber}. {specimen.commonName}
          </h3>
        </div>

        {/* Binomial Scientific Name & Alternate Common Names */}
        <div className="sm:text-right">
          <div className="text-base sm:text-lg font-serif-display italic font-semibold text-[#1B432C]">
            {specimen.taxonomy.scientificName}
          </div>
          <div className="text-xs text-[#465749]">
            {specimen.alternateNames.join(' · ')}
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Geotagged Leaf Photo (Left) + Taxonomic Sheet & Globe (Right) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Geotagged Specimen Photo + Caption */}
        <div className="lg:col-span-5 space-y-3">
          <BotanicalSpecimenArtwork
            specimen={specimen}
            customImageUrl={customImageUrl}
            onUploadCustomImage={onUploadCustomImage}
            showGeotagOverlay={showGeotagOverlay}
            onToggleGeotagOverlay={onToggleGeotagOverlay}
          />

          <div className="flex items-center justify-between text-xs text-[#465749] px-1">
            <span className="italic font-serif-display text-sm text-[#162319]">
              Fig. {specimen.entryNumber} — {specimen.commonName} ({specimen.taxonomy.species})
            </span>
            <span className="font-mono-tabular text-[11px]">
              {specimen.geotag.latDisplay} N, {specimen.geotag.lngDisplay} E
            </span>
          </div>
        </div>

        {/* Right Column (7 cols): Taxonomic Hierarchy + Characteristics + Uses + Interactive World Globe */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          {/* Taxonomic Classification Grid */}
          <div className="bg-[#F6F4EC] rounded-xl p-4 border border-[#D6DFD0]">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#D6DFD0]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#162319]">
                Botanical Classification
              </span>
              <span className="text-[11px] font-mono-tabular text-[#465749]">
                Entry #{specimen.entryNumber}
              </span>
            </div>

            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-xs">
              <div>
                <dt className="text-[#465749] uppercase tracking-wider text-[10px]">
                  Kingdom
                </dt>
                <dd className="font-semibold text-[#162319] mt-0.5 text-sm">
                  {specimen.taxonomy.kingdom}
                </dd>
              </div>
              <div>
                <dt className="text-[#465749] uppercase tracking-wider text-[10px]">
                  Order
                </dt>
                <dd className="font-semibold text-[#162319] mt-0.5 text-sm">
                  {specimen.taxonomy.order}
                </dd>
              </div>
              <div>
                <dt className="text-[#465749] uppercase tracking-wider text-[10px]">
                  Family
                </dt>
                <dd className="font-semibold text-[#162319] mt-0.5 text-sm">
                  {specimen.taxonomy.family}
                </dd>
              </div>
              <div>
                <dt className="text-[#465749] uppercase tracking-wider text-[10px]">
                  Genus
                </dt>
                <dd className="font-serif-display italic font-semibold text-[#162319] mt-0.5 text-base">
                  {specimen.taxonomy.genus}
                </dd>
              </div>
              <div>
                <dt className="text-[#465749] uppercase tracking-wider text-[10px]">
                  Species
                </dt>
                <dd className="font-serif-display italic font-semibold text-[#162319] mt-0.5 text-base">
                  {specimen.taxonomy.species}
                </dd>
              </div>
              <div>
                <dt className="text-[#465749] uppercase tracking-wider text-[10px]">
                  Scientific Name
                </dt>
                <dd className="font-serif-display italic font-bold text-[#1B432C] mt-0.5 text-base">
                  {specimen.taxonomy.scientificName}
                </dd>
              </div>
            </dl>
          </div>

          {/* Characteristics & Uses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-[#D6DFD0] bg-[#FCFBF7]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#465749]">
                Characteristics
              </div>
              <p className="mt-1.5 text-sm text-[#162319] leading-relaxed">
                {specimen.characteristics}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#D6DFD0] bg-[#FCFBF7]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#465749]">
                Uses
              </div>
              <p className="mt-1.5 text-sm font-medium text-[#1B432C] leading-relaxed">
                {specimen.usesSummary}
              </p>
              <div className="mt-1.5 text-xs text-[#465749]">
                {specimen.uses.join(' · ')}
              </div>
            </div>
          </div>

          {/* Interactive World Globe Element Indicating Geographical Origin */}
          <MiniSpeciesGlobe
            commonName={specimen.commonName}
            scientificName={specimen.taxonomy.scientificName}
            nativeOrigin={specimen.nativeOrigin}
            geotag={specimen.geotag}
            accentColor={specimen.accentColor}
            size="compact"
          />

          {/* Expandable Section Dropdowns for Foliar Morphology & Geotag Record */}
          <div className="space-y-2 pt-1">
            {/* Dropdown 1: Foliar Morphology Details */}
            <div className="border border-[#D6DFD0] rounded-lg overflow-hidden bg-[#F6F4EC]/60">
              <button
                type="button"
                onClick={() => toggleDropdown('morphology')}
                aria-expanded={openDropdown === 'morphology'}
                className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-[#162319] hover:bg-[#EBF0E8] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Leaf className="w-3.5 h-3.5 text-[#1B432C]" />
                  <span>Foliar Anatomy &amp; Specimen Notes</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#465749] transition-transform duration-200 ${
                    openDropdown === 'morphology' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'morphology' && (
                <div className="px-3.5 py-3 text-xs text-[#465749] border-t border-[#D6DFD0] bg-[#FCFBF7] leading-relaxed space-y-1.5">
                  <p>{specimen.leafMorphologyDetails}</p>
                  <p className="text-[#162319] font-medium">
                    Specimen File: <span className="font-mono-tabular">{specimen.fileName}</span> ({specimen.commonName})
                  </p>
                </div>
              )}
            </div>

            {/* Dropdown 2: Exact Geotag GPS Log */}
            <div className="border border-[#D6DFD0] rounded-lg overflow-hidden bg-[#F6F4EC]/60">
              <button
                type="button"
                onClick={() => toggleDropdown('geotag')}
                aria-expanded={openDropdown === 'geotag'}
                className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-[#162319] hover:bg-[#EBF0E8] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-[#B6862C]" />
                  <span>Indore GPS Geotag &amp; Collection Location</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#465749] transition-transform duration-200 ${
                    openDropdown === 'geotag' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'geotag' && (
                <div className="px-3.5 py-3 text-xs text-[#465749] border-t border-[#D6DFD0] bg-[#FCFBF7] space-y-2.5">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#1B432C] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#162319]">
                        {specimen.geotag.address}
                      </div>
                      <div className="font-mono-tabular text-[11px] mt-0.5">
                        Lat {specimen.geotag.latDisplay} · Long {specimen.geotag.lngDisplay} · {specimen.geotag.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
