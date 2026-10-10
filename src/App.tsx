import React, { useEffect, useRef, useState } from 'react';
import {
  Leaf,
  Globe,
  Upload,
  Search,
  ChevronDown,
  MapPin,
  Eye,
  RotateCcw,
} from 'lucide-react';
import {
  HERBARIUM_SPECIMENS,
  DEFAULT_TEAM_PHOTO,
  TEAM_MEMBERS,
  HerbariumSpecimen,
} from './data/herbariumData';
import { GoldenLeafIntro } from './components/GoldenLeafIntro';
import { InteractiveForestAndCursor } from './components/InteractiveForestAndCursor';
import { HerbariumSpecimenSheet } from './components/HerbariumSpecimenSheet';
import { MeetTheTeamSection } from './components/MeetTheTeamSection';
import { MiniSpeciesGlobe } from './components/MiniSpeciesGlobe';

const STORAGE_KEY_IMAGES = 'golden_leaf_herbarium_custom_images_v2';
const STORAGE_KEY_TEAM = 'golden_leaf_herbarium_team_photo_v2';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [leafCursorEnabled, setLeafCursorEnabled] = useState<boolean>(true);
  const [showGeotagOverlays, setShowGeotagOverlays] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGlobeSpecimenId, setSelectedGlobeSpecimenId] = useState<string>(
    HERBARIUM_SPECIMENS[0].id
  );
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  const [teamPhotoUrl, setTeamPhotoUrl] = useState<string>(DEFAULT_TEAM_PHOTO);
  const [diagramPhotoUrl, setDiagramPhotoUrl] = useState<string | null>(null);
  const [batchMatchMessage, setBatchMatchMessage] = useState<string | null>(null);

  const batchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const savedImages = localStorage.getItem(STORAGE_KEY_IMAGES);
      if (savedImages) {
        setCustomImages(JSON.parse(savedImages));
      }
      const savedTeam = localStorage.getItem(STORAGE_KEY_TEAM);
      if (savedTeam) {
        setTeamPhotoUrl(savedTeam);
      }
    } catch {
      // Ignore storage quota or parse errors
    }
  }, []);

  const handleUploadCustomImage = (specimenId: string, dataUrl: string) => {
    setCustomImages((prev) => {
      const next = { ...prev, [specimenId]: dataUrl };
      try {
        localStorage.setItem(STORAGE_KEY_IMAGES, JSON.stringify(next));
      } catch {
        // Ignore quota limits
      }
      return next;
    });
  };

  const handleUploadTeamPhoto = (dataUrl: string) => {
    setTeamPhotoUrl(dataUrl);
    try {
      localStorage.setItem(STORAGE_KEY_TEAM, dataUrl);
    } catch {
      // Ignore quota limits
    }
  };

  const processFiles = (files: FileList | File[]) => {
    let matchedCount = 0;
    Array.from(files).forEach((file) => {
      const lower = file.name.toLowerCase();
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== 'string') return;
        const dataUrl = reader.result;

        if (lower.includes('team') && !lower.includes('desci')) {
          handleUploadTeamPhoto(dataUrl);
          matchedCount++;
        } else if (lower.includes('desci') || lower.includes('diagram')) {
          setDiagramPhotoUrl(dataUrl);
          matchedCount++;
        } else {
          const matchedSpecimen = HERBARIUM_SPECIMENS.find((sp) => {
            const targetBase = sp.fileName
              .toLowerCase()
              .replace(/\.(jpg|jpeg|png|webp)$/, '');
            return (
              lower.includes(targetBase) ||
              lower.includes(sp.commonName.toLowerCase()) ||
              lower.includes(sp.taxonomy.genus.toLowerCase())
            );
          });
          if (matchedSpecimen) {
            handleUploadCustomImage(matchedSpecimen.id, dataUrl);
            matchedCount++;
          }
        }
        setBatchMatchMessage(
          `Loaded ${matchedCount} photo(s) into the herbarium archive.`
        );
      };
      reader.readAsDataURL(file);
    });
  };

  const handleBatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    processFiles(e.target.files);
  };

  const uniqueOrders = [
    'All',
    ...Array.from(new Set(HERBARIUM_SPECIMENS.map((s) => s.taxonomy.order))),
  ];

  const categories = [
    'All',
    'Medicinal',
    'Ornamental & Hedges',
    'Air Purification',
    'Ecological & Timber',
  ];

  const filteredSpecimens = HERBARIUM_SPECIMENS.filter((sp) => {
    const matchesCat =
      selectedCategory === 'All' || sp.useCategory === selectedCategory;
    const matchesOrder =
      selectedOrder === 'All' || sp.taxonomy.order === selectedOrder;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      sp.commonName.toLowerCase().includes(q) ||
      sp.fileName.toLowerCase().includes(q) ||
      sp.taxonomy.scientificName.toLowerCase().includes(q) ||
      sp.taxonomy.family.toLowerCase().includes(q) ||
      sp.taxonomy.order.toLowerCase().includes(q) ||
      sp.usesSummary.toLowerCase().includes(q);
    return matchesCat && matchesOrder && matchesQuery;
  });

  const activeGlobeSpecimen: HerbariumSpecimen =
    HERBARIUM_SPECIMENS.find((s) => s.id === selectedGlobeSpecimenId) ||
    HERBARIUM_SPECIMENS[0];

  const scrollToSpecimen = (specimenId: string) => {
    const el = document.getElementById(`specimen-${specimenId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          processFiles(e.dataTransfer.files);
        }
      }}
      className="min-h-screen bg-[#F6F4EC] text-[#162319] relative selection:bg-[#1B432C] selection:text-white"
    >
      {/* 3-Second Golden Leaf Opening Animation with 6-Member Team Photo */}
      <GoldenLeafIntro
        isVisible={showIntro}
        teamPhotoUrl={teamPhotoUrl}
        onComplete={() => setShowIntro(false)}
      />

      {/* Interactive Forest Canopy Parallax & Gliding Leaf Cursor */}
      <InteractiveForestAndCursor enabled={leafCursorEnabled} />

      {/* 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 bg-[#FCFBF7]/90 backdrop-blur-md border-b border-[#D6DFD0] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#top"
          className="text-xl sm:text-2xl font-serif-display font-bold tracking-tight text-[#162319] whitespace-nowrap shrink-0"
        >
          Golden Leaf Herbarium
        </a>

        {/* Zone 2: 4 Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#465749]"
        >
          <a
            href="#herbarium-collection"
            className="hover:text-[#162319] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Specimen Archive
          </a>
          <a
            href="#biogeography-globe"
            className="hover:text-[#162319] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            World Origin Globe
          </a>
          <a
            href="#meet-the-team"
            className="hover:text-[#162319] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Meet the Team
          </a>
          <a
            href="#taxonomic-index"
            className="hover:text-[#162319] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Taxonomic Index
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action Button (Replay 3s Golden Leaf Team Intro) */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setShowIntro(true)}
            className="px-4 py-2 text-xs font-medium text-white bg-[#1B432C] hover:bg-[#143321] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Replay Golden Leaf Intro
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main id="top" className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-10 pb-12 border-b border-[#D6DFD0]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#465749]">
                  <span>Botanical Field Dossier</span>
                  <span aria-hidden="true">·</span>
                  <span>Indore, Madhya Pradesh (452015)</span>
                  <span aria-hidden="true">·</span>
                  <span>10 Foliar Entries</span>
                </div>

                <h1
                  className="text-4xl sm:text-5xl lg:text-[54px] font-serif-display font-semibold text-[#162319] leading-[1.08] tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Digital Herbarium &amp; Geotagged Leaf Taxonomy Archive
                </h1>

                <p className="text-base text-[#465749] leading-relaxed max-w-2xl">
                  An interactive botanical catalog documenting ten living plant species
                  surveyed across Kushwaha Nagar and Banganga in Indore. Every specimen
                  entry is titled by its plant common name, paired with binomial
                  nomenclature, GPS Map Camera telemetry, and an interactive 3D world
                  origin globe.
                </p>
              </div>

              {/* Quick Specimen Jump Dropdown + Batch Photo Uploader */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="relative">
                  <select
                    aria-label="Jump to plant specimen by common name"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        scrollToSpecimen(e.target.value);
                      }
                    }}
                    className="appearance-none bg-[#FCFBF7] border border-[#1B432C] text-[#162319] text-xs font-semibold rounded-lg pl-3.5 pr-9 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1B432C]"
                  >
                    <option value="" disabled>
                      Jump to Plant Common Name (01–10)...
                    </option>
                    {HERBARIUM_SPECIMENS.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.entryNumber}. {sp.commonName} ({sp.taxonomy.scientificName})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#1B432C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <input
                  ref={batchInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleBatchUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => batchInputRef.current?.click()}
                  className="px-4 py-2.5 text-xs font-medium bg-[#EBF0E8] hover:bg-[#D6DFD0] text-[#162319] border border-[#D6DFD0] rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#1B432C]" />
                  <span>Select Uploaded Photos</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLeafCursorEnabled((prev) => !prev)}
                  className="px-3.5 py-2.5 text-xs font-medium bg-[#FCFBF7] hover:bg-[#EBF0E8] text-[#465749] border border-[#D6DFD0] rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Leaf className="w-3.5 h-3.5 text-[#1B432C]" />
                  <span>Leaf Cursor: {leafCursorEnabled ? 'On' : 'Off'}</span>
                </button>
              </div>

              {batchMatchMessage && (
                <p className="text-xs font-medium text-[#1B432C]">
                  {batchMatchMessage}
                </p>
              )}
            </div>

            {/* Right Hero Column: Featured Expedition Team Preview Card */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#FCFBF7] border border-[#D6DFD0] rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-[#162319]">
                <img
                  src={teamPhotoUrl}
                  alt="Six-member Golden Leaf Herbarium team"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-end justify-between gap-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#E7C675]">
                      Golden Leaf Curators · 6 Members
                    </div>
                    <div className="text-sm font-serif-display font-semibold">
                      Adventure · Truth · Together
                    </div>
                  </div>
                  <a
                    href="#meet-the-team"
                    className="px-2.5 py-1 text-[11px] font-medium bg-[#B6862C] text-white rounded hover:bg-[#9E7222] transition-colors whitespace-nowrap shrink-0"
                  >
                    Team Roles
                  </a>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D6DFD0] flex flex-wrap items-center justify-between gap-2 text-xs text-[#465749]">
                <span>
                  Curators:{' '}
                  <strong className="text-[#162319]">
                    {TEAM_MEMBERS.map((m) => m.name.split(' ')[0]).join(', ')}
                  </strong>
                </span>
                <span className="font-mono-tabular text-[#1B432C] font-medium">
                  04/10/2026 · GMT +05:30
                </span>
              </div>
            </div>
          </div>

          {/* Operational Summary Strip */}
          <div className="mt-8 pt-5 border-t border-[#D6DFD0] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#465749]">
            <div>
              <div className="uppercase tracking-wider text-[10px]">Kingdom</div>
              <div className="text-base font-serif-display font-bold text-[#162319] mt-0.5">
                100% Plantae (10 Species)
              </div>
            </div>
            <div>
              <div className="uppercase tracking-wider text-[10px]">Taxonomic Orders</div>
              <div className="text-base font-serif-display font-bold text-[#162319] mt-0.5">
                9 Distinct Botanical Orders
              </div>
            </div>
            <div>
              <div className="uppercase tracking-wider text-[10px]">Collection Coordinates</div>
              <div className="text-sm font-mono-tabular font-semibold text-[#1B432C] mt-0.5">
                22.7509° N – 22.7512° N
              </div>
            </div>
          </div>
        </section>

        {/* Herbarium Specimen Sheets Section (All 10 Leaves with Common Name Headings) */}
        <section
          id="herbarium-collection"
          aria-labelledby="collection-heading"
          className="max-w-[1240px] mx-auto px-4 sm:px-8 py-14"
        >
          {/* Filter & Search Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#D6DFD0]">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#465749] font-medium">
                Complete Foliar Catalog · Headings Named by Plant Common Name
              </div>
              <h2
                id="collection-heading"
                className="mt-1 text-3xl sm:text-4xl font-serif-display font-semibold text-[#162319]"
              >
                Herbarium Specimen Sheets (01 – 10)
              </h2>
            </div>

            {/* Interactive Controls: Search, Order Dropdown, Geotag Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#465749] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search common or scientific name..."
                  className="bg-[#FCFBF7] border border-[#D6DFD0] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#162319] placeholder:text-[#465749]/70 focus:outline-none focus:border-[#1B432C] w-56"
                />
              </div>

              <div className="relative">
                <select
                  aria-label="Filter by Botanical Order"
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  className="appearance-none bg-[#FCFBF7] border border-[#D6DFD0] rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-[#162319] cursor-pointer focus:outline-none focus:border-[#1B432C]"
                >
                  {uniqueOrders.map((ord) => (
                    <option key={ord} value={ord}>
                      {ord === 'All' ? 'All Orders (9)' : `Order: ${ord}`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#465749] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="button"
                onClick={() => setShowGeotagOverlays((prev) => !prev)}
                className="px-3 py-1.5 text-xs font-medium bg-[#FCFBF7] hover:bg-[#EBF0E8] border border-[#D6DFD0] rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#1B432C]" />
                <span>GPS Overlay: {showGeotagOverlays ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>
          </div>

          {/* Functional Segmented Filter Bar by Botanical Use Category */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div
              role="group"
              aria-label="Filter specimens by primary use"
              className="flex flex-wrap items-center gap-1 p-1 bg-[#EBF0E8] rounded-lg border border-[#D6DFD0]"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#1B432C] text-white shadow-xs'
                      : 'text-[#465749] hover:text-[#162319]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#465749]">
              {HERBARIUM_SPECIMENS.map((sp, i) => (
                <React.Fragment key={sp.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSpecimen(sp.id)}
                    className="hover:text-[#1B432C] hover:underline font-medium cursor-pointer whitespace-nowrap"
                  >
                    {sp.entryNumber}. {sp.commonName}
                  </button>
                  {i < HERBARIUM_SPECIMENS.length - 1 && (
                    <span aria-hidden="true">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Specimen Cards List */}
          {filteredSpecimens.length === 0 ? (
            <div className="mt-8 p-12 text-center bg-[#FCFBF7] border border-[#D6DFD0] rounded-2xl space-y-3">
              <p className="text-base font-serif-display text-[#162319]">
                No herbarium specimens match your current filter criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedOrder('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-xs font-medium bg-[#1B432C] text-white rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          ) : (
            <div className="mt-8 space-y-8">
              {filteredSpecimens.map((specimen) => (
                <HerbariumSpecimenSheet
                  key={specimen.id}
                  specimen={specimen}
                  customImageUrl={customImages[specimen.id]}
                  onUploadCustomImage={handleUploadCustomImage}
                  showGeotagOverlay={showGeotagOverlays}
                  onToggleGeotagOverlay={() =>
                    setShowGeotagOverlays((prev) => !prev)
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* Master Global Biogeography & Indore GPS Survey Explorer */}
        <section
          id="biogeography-globe"
          aria-labelledby="globe-section-heading"
          className="py-16 border-t border-[#D6DFD0] bg-[#EBF0E8]/60"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
            <div className="max-w-2xl space-y-2">
              <div className="text-xs uppercase tracking-widest text-[#465749] font-medium">
                Global Biogeography &amp; Indore Field Coordinates
              </div>
              <h2
                id="globe-section-heading"
                className="text-3xl sm:text-4xl font-serif-display font-semibold text-[#162319]"
              >
                Interactive Earth Origin &amp; Collection Atlas
              </h2>
              <p className="text-sm text-[#465749] leading-relaxed">
                Select any of the ten herbarium species below to inspect its native
                evolutionary center of origin alongside its field collection point in
                Indore, Madhya Pradesh (`22.75° N, 75.85° E`).
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 bg-[#FCFBF7] border border-[#D6DFD0] rounded-2xl p-4 space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#465749] px-2 pb-2 border-b border-[#D6DFD0] flex justify-between">
                  <span>Plant Common Name (File)</span>
                  <span>Native Continent</span>
                </div>
                {HERBARIUM_SPECIMENS.map((sp) => {
                  const active = sp.id === selectedGlobeSpecimenId;
                  return (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => setSelectedGlobeSpecimenId(sp.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#1B432C] text-white font-semibold'
                          : 'hover:bg-[#EBF0E8] text-[#162319]'
                      }`}
                    >
                      <span className="truncate">
                        {sp.entryNumber}. {sp.commonName}{' '}
                        <em className={active ? 'text-white/85' : 'text-[#465749]'}>
                          ({sp.taxonomy.species})
                        </em>
                      </span>
                      <span
                        className={`text-[11px] shrink-0 ${
                          active ? 'text-[#E7C675]' : 'text-[#465749]'
                        }`}
                      >
                        {sp.nativeOrigin.continent}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="bg-[#FCFBF7] border border-[#D6DFD0] rounded-2xl p-5">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D6DFD0]">
                    <div>
                      <span className="text-xs font-mono-tabular text-[#1B432C] font-semibold">
                        ENTRY #{activeGlobeSpecimen.entryNumber} · {activeGlobeSpecimen.fileName}
                      </span>
                      <h3 className="text-2xl font-serif-display font-bold text-[#162319]">
                        {activeGlobeSpecimen.commonName} (
                        <em className="font-normal">
                          {activeGlobeSpecimen.taxonomy.scientificName}
                        </em>
                        )
                      </h3>
                    </div>
                    <Globe className="w-6 h-6 text-[#1B432C]" />
                  </div>

                  <MiniSpeciesGlobe
                    commonName={activeGlobeSpecimen.commonName}
                    scientificName={activeGlobeSpecimen.taxonomy.scientificName}
                    nativeOrigin={activeGlobeSpecimen.nativeOrigin}
                    geotag={activeGlobeSpecimen.geotag}
                    accentColor={activeGlobeSpecimen.accentColor}
                    size="large"
                  />

                  <div className="mt-4 pt-3 border-t border-[#D6DFD0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#465749]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B6862C] shrink-0" />
                      <span className="text-[#162319] font-medium">
                        {activeGlobeSpecimen.geotag.address}
                      </span>
                    </div>
                    <span className="font-mono-tabular">
                      {activeGlobeSpecimen.geotag.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <MeetTheTeamSection
          teamPhotoUrl={teamPhotoUrl}
          onUploadTeamPhoto={handleUploadTeamPhoto}
          diagramPhotoUrl={diagramPhotoUrl}
          onUploadDiagramPhoto={(url) => setDiagramPhotoUrl(url)}
        />

        {/* Complete Taxonomic & Geotag Master Index Table */}
        <section
          id="taxonomic-index"
          aria-labelledby="index-heading"
          className="max-w-[1240px] mx-auto px-4 sm:px-8 py-16 border-t border-[#D6DFD0]"
        >
          <div className="space-y-2 pb-6">
            <div className="text-xs uppercase tracking-widest text-[#465749] font-medium">
              Botanical Specimen Index
            </div>
            <h2
              id="index-heading"
              className="text-3xl font-serif-display font-semibold text-[#162319]"
            >
              Master Taxonomic &amp; Indore GPS Geotag Index (01 – 10)
            </h2>
          </div>

          <div className="overflow-x-auto bg-[#FCFBF7] border border-[#D6DFD0] rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#D6DFD0] bg-[#F6F4EC] text-[#465749] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Common Name (File Name)</th>
                  <th className="py-3 px-4">Order &amp; Family</th>
                  <th className="py-3 px-4">Scientific Name</th>
                  <th className="py-3 px-4">Uses</th>
                  <th className="py-3 px-4">Indore GPS Coordinates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6DFD0]">
                {HERBARIUM_SPECIMENS.map((sp) => (
                  <tr
                    key={sp.id}
                    onClick={() => scrollToSpecimen(sp.id)}
                    className="hover:bg-[#EBF0E8]/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono-tabular font-semibold text-[#1B432C]">
                      {sp.entryNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#162319] text-sm">
                        {sp.commonName}
                      </div>
                      <div className="font-mono-tabular text-[11px] text-[#465749]">
                        {sp.fileName}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#162319]">
                      <div>{sp.taxonomy.order}</div>
                      <div className="text-[#465749]">{sp.taxonomy.family}</div>
                    </td>
                    <td className="py-3 px-4 font-serif-display italic text-sm font-semibold text-[#1B432C]">
                      {sp.taxonomy.scientificName}
                    </td>
                    <td className="py-3 px-4 text-[#465749] max-w-xs">
                      {sp.usesSummary}
                    </td>
                    <td className="py-3 px-4 font-mono-tabular text-[11px] text-[#162319] whitespace-nowrap">
                      <div>
                        {sp.geotag.latDisplay} N, {sp.geotag.lngDisplay} E
                      </div>
                      <div className="text-[#465749] text-[10px]">
                        {sp.geotag.timestamp.replace('Sunday, ', '')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Quiet Archival Footer */}
      <footer className="border-t border-[#D6DFD0] bg-[#FCFBF7] py-8 px-4 sm:px-8 text-xs text-[#465749] relative z-10">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-serif-display font-bold text-sm text-[#162319]">
              Golden Leaf Herbarium Project
            </span>
            <span> · </span>
            <span>
              Indore, Madhya Pradesh (452015) · Rudraksh, Vedanshi, Dolly, Shikha,
              Rupali &amp; Umang
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowIntro(true)}
              className="hover:text-[#162319] underline underline-offset-4 cursor-pointer"
            >
              Replay 3s Golden Leaf Intro
            </button>
            <span>·</span>
            <a href="#top" className="hover:text-[#162319] underline underline-offset-4">
              Back to Top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
