import React, { useRef, useState } from 'react';
import { Upload, Users, Compass, BookOpen, Award } from 'lucide-react';
import { TEAM_MEMBERS, TeamMember } from '../data/herbariumData';

interface MeetTheTeamSectionProps {
  teamPhotoUrl: string;
  onUploadTeamPhoto: (dataUrl: string) => void;
  diagramPhotoUrl?: string | null;
  onUploadDiagramPhoto?: (dataUrl: string) => void;
}

export const MeetTheTeamSection: React.FC<MeetTheTeamSectionProps> = ({
  teamPhotoUrl,
  onUploadTeamPhoto,
  diagramPhotoUrl,
  onUploadDiagramPhoto,
}) => {
  const [activeMemberId, setActiveMemberId] = useState<string>(TEAM_MEMBERS[2].id);
  const [viewMode, setViewMode] = useState<'interactive' | 'diagram'>('interactive');
  const teamInputRef = useRef<HTMLInputElement | null>(null);
  const diagramInputRef = useRef<HTMLInputElement | null>(null);

  const activeMember: TeamMember =
    TEAM_MEMBERS.find((m) => m.id === activeMemberId) || TEAM_MEMBERS[0];

  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback?: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file || !callback) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section
      id="meet-the-team"
      aria-labelledby="team-section-heading"
      className="py-16 sm:py-20 border-t border-[#D6DFD0] bg-[#FCFBF7]/90 relative z-10"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        {/* Editorial Section Header & Project Introduction */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-[#D6DFD0]">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs tracking-widest uppercase text-[#465749] font-medium">
              Expedition Collective · Six-Member Herbarium Curators
            </div>
            <h2
              id="team-section-heading"
              className="text-3xl sm:text-4xl lg:text-[42px] font-serif-display font-semibold text-[#162319] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Meet the Golden Leaf Team
            </h2>
            <p className="text-sm sm:text-base text-[#465749] leading-relaxed">
              Guided by the field motto{' '}
              <span className="font-semibold text-[#162319]">
                &ldquo;Adventure · Truth · Together&rdquo;
              </span>
              , our six-member botanical team conducted on-site field collection across
              Kushwaha Nagar and Banganga in Indore, Madhya Pradesh (452015). From live
              GPS specimen reconnaissance and pressing preservation to taxonomic
              documentation and sheet decoration, every member contributed a specialized
              discipline to this digital and physical herbarium archive.
            </p>
          </div>

          {/* Controls to upload original team.jpeg or switch view */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <input
              ref={teamInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoChange(e, onUploadTeamPhoto)}
              className="hidden"
              aria-label="Upload team.jpeg group photograph"
            />
            <button
              type="button"
              onClick={() => teamInputRef.current?.click()}
              className="px-3.5 py-2 text-xs font-medium text-[#162319] bg-[#EBF0E8] hover:bg-[#D6DFD0] border border-[#D6DFD0] rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#1B432C]" />
              <span>Upload team.jpeg</span>
            </button>

            {onUploadDiagramPhoto && (
              <>
                <input
                  ref={diagramInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handlePhotoChange(e, onUploadDiagramPhoto);
                    setViewMode('diagram');
                  }}
                  className="hidden"
                  aria-label="Upload team description diagram photo"
                />
                <button
                  type="button"
                  onClick={() => diagramInputRef.current?.click()}
                  className="px-3.5 py-2 text-xs font-medium text-[#162319] bg-[#F6F4EC] hover:bg-[#EBF0E8] border border-[#D6DFD0] rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#B6862C]" />
                  <span>Upload Sheet Diagram</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Interactive Herbarium Team Callout Diagram */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* LEFT COLUMN: 6 Leaf-Shaped Member Name Callouts */}
          <div
            className="lg:col-span-3 flex flex-col gap-3 order-2 lg:order-1"
            role="tablist"
            aria-label="Team member names"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-[#465749] pb-1 border-b border-[#D6DFD0] flex items-center justify-between">
              <span>Botanist Name</span>
              <span>Left to Right</span>
            </div>
            {TEAM_MEMBERS.map((member) => {
              const isSelected = member.id === activeMemberId;
              return (
                <button
                  key={member.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveMemberId(member.id)}
                  onMouseEnter={() => setActiveMemberId(member.id)}
                  className={`group relative w-full text-left px-4 py-3 rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#1B432C] text-white border-[#1B432C] shadow-sm translate-x-1'
                      : 'bg-[#EBF0E8]/90 text-[#162319] border-[#C5D6C8] hover:bg-[#DFEAE0]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`font-mono-tabular text-xs font-semibold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-[#FCFBF7] text-[#1B432C]'
                      }`}
                    >
                      0{member.index}
                    </span>
                    <span className="font-serif-display text-lg font-semibold tracking-tight truncate">
                      {member.name}
                    </span>
                  </div>
                  {/* Pointer Connector Indicator toward Center Photo */}
                  <span
                    aria-hidden="true"
                    className={`hidden lg:inline-block w-4 h-0.5 transition-colors ${
                      isSelected ? 'bg-[#B6862C]' : 'bg-[#162319]/30'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* CENTER COLUMN: Group Photo of 6 Members with Interactive Hotspots */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="bg-[#F6F4EC] p-3 sm:p-4 rounded-2xl border border-[#D6DFD0] shadow-sm">
              {viewMode === 'diagram' && diagramPhotoUrl ? (
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#162319]">
                  <img
                    src={diagramPhotoUrl}
                    alt="Original physical herbarium team diagram sheet"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setViewMode('interactive')}
                    className="absolute top-3 right-3 px-3 py-1.5 text-xs font-medium bg-black/75 text-white rounded-md hover:bg-black/90 cursor-pointer"
                  >
                    Back to Group Portrait
                  </button>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#162319] group">
                  <img
                    src={teamPhotoUrl}
                    alt="Group portrait of the 6 Golden Leaf Herbarium team members in the forest: Rudraksh Kushwah, Vedanshi Vyas, Dolly Thakur K., Shikha Madariya, Rupali Yadav, and Umang Rajak"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* Subtle Bottom Scrim for Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none" />

                  {/* Top Forest Sign Badge matching the photo */}
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-md bg-black/65 backdrop-blur-sm border border-white/15 text-[11px] font-mono-tabular tracking-widest uppercase text-[#F3E3B2]">
                    Adventure · Truth · Together
                  </div>

                  {/* Interactive Member Number Markers across the 6 Botanists (Left to Right) */}
                  {TEAM_MEMBERS.map((member) => {
                    const isSelected = member.id === activeMemberId;
                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => setActiveMemberId(member.id)}
                        onMouseEnter={() => setActiveMemberId(member.id)}
                        style={{
                          left: `${member.photoSpot.x}%`,
                          top: `${member.photoSpot.y}%`,
                        }}
                        aria-label={`Select ${member.name}, ${member.role}`}
                        className={`-translate-x-1/2 -translate-y-1/2 absolute z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full font-mono-tabular text-xs font-bold flex items-center justify-center transition-transform cursor-pointer ${
                          isSelected
                            ? 'bg-[#B6862C] text-white scale-125 ring-4 ring-white/80 shadow-lg'
                            : 'bg-black/70 text-white/90 hover:bg-[#1B432C] border border-white/60 hover:scale-110'
                        }`}
                      >
                        {member.index}
                      </button>
                    );
                  })}

                  {/* Active Member Spotlight Caption Bar Inside Portrait */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 bg-black/75 backdrop-blur-md border border-white/15 rounded-lg p-3 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-[#F3E3B2] font-medium">
                        Member 0{activeMember.index} of 06 · {activeMember.role}
                      </div>
                      <div className="text-lg font-serif-display font-semibold text-white">
                        {activeMember.name}
                      </div>
                    </div>
                    <div className="text-xs text-white/85 max-w-xs leading-snug">
                      {activeMember.contribution}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: 6 Leaf-Shaped Role Callouts */}
          <div className="lg:col-span-3 flex flex-col gap-3 order-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#465749] pb-1 border-b border-[#D6DFD0] flex items-center justify-between">
              <span>Project Role</span>
              <span>Responsibility</span>
            </div>
            {TEAM_MEMBERS.map((member) => {
              const isSelected = member.id === activeMemberId;
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setActiveMemberId(member.id)}
                  onMouseEnter={() => setActiveMemberId(member.id)}
                  className={`group relative w-full text-left px-4 py-3 rounded-tr-2xl rounded-bl-2xl rounded-tl-md rounded-br-md border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#B6862C] text-white border-[#B6862C] shadow-sm -translate-x-1'
                      : 'bg-[#EBF0E8]/90 text-[#162319] border-[#C5D6C8] hover:bg-[#DFEAE0]'
                  }`}
                >
                  {/* Pointer Connector Indicator toward Center Photo */}
                  <span
                    aria-hidden="true"
                    className={`hidden lg:inline-block w-4 h-0.5 transition-colors shrink-0 ${
                      isSelected ? 'bg-white' : 'bg-[#162319]/30'
                    }`}
                  />
                  <div className="flex-1 min-w-0 text-right lg:text-left">
                    <div className="text-xs sm:text-sm font-semibold tracking-tight truncate">
                      {member.role}
                    </div>
                    <div
                      className={`text-[11px] truncate ${
                        isSelected ? 'text-white/90' : 'text-[#465749]'
                      }`}
                    >
                      {member.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Complete 6-Member Accessible Roster Grid Below */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEAM_MEMBERS.map((member) => {
            const isSelected = member.id === activeMemberId;
            return (
              <div
                key={member.id}
                onClick={() => setActiveMemberId(member.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#F6F4EC] border-[#1B432C] shadow-sm'
                    : 'bg-[#FCFBF7] border-[#D6DFD0] hover:border-[#1B432C]/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[#465749]">
                  <span className="font-mono-tabular font-semibold text-[#1B432C]">
                    Botanist 0{member.index}
                  </span>
                  <span>·</span>
                  <span className="font-medium text-[#B6862C] truncate">{member.role}</span>
                </div>
                <h3 className="mt-1 text-xl font-serif-display font-semibold text-[#162319]">
                  {member.name}
                </h3>
                <p className="mt-1.5 text-xs text-[#465749] leading-relaxed">
                  {member.contribution}
                </p>
              </div>
            );
          })}
        </div>

        {/* Project Summary Strip */}
        <div className="mt-8 pt-6 border-t border-[#D6DFD0] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#465749]">
          <div className="flex items-start gap-2.5">
            <Users className="w-4 h-4 text-[#1B432C] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#162319]">6-Member Field Unit: </span>
              Collaborative division of collection, pressing, taxonomy, report writing, and creative sheet design.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Compass className="w-4 h-4 text-[#1B432C] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#162319]">Survey Zone: </span>
              Kushwaha Nagar, Bhagat Singh Nagar &amp; Banganga, Indore, Madhya Pradesh 452015.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Award className="w-4 h-4 text-[#B6862C] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#162319]">Botanical Taxonomy: </span>
              All 10 foliar specimens cataloged with binomial nomenclature and GPS timestamps.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
