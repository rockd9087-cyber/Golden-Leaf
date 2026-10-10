import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/herbariumData';

interface GoldenLeafIntroProps {
  isVisible: boolean;
  teamPhotoUrl: string;
  onComplete: () => void;
}

export const GoldenLeafIntro: React.FC<GoldenLeafIntroProps> = ({
  isVisible,
  teamPhotoUrl,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      return;
    }

    const durationMs = 3000;
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(pct);
      if (elapsed < durationMs) {
        rafId = requestAnimationFrame(tick);
      } else {
        onComplete();
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="golden-leaf-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 bg-[#121D15] text-[#FCFBF7] flex flex-col items-center justify-center overflow-hidden px-4 py-6"
        >
          {/* Sweeping Golden Leaf Shimmer Backdrop */}
          <motion.div
            initial={{ x: '-100%', opacity: 0.3 }}
            animate={{ x: '100%', opacity: 0.7 }}
            transition={{ duration: 3, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#B6862C]/30 to-transparent pointer-events-none"
          />

          {/* Floating Golden Leaves During 3s Transition */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[
              { left: '12%', delay: 0.1, dur: 2.8, rot: 35 },
              { left: '28%', delay: 0.3, dur: 2.6, rot: -40 },
              { left: '48%', delay: 0.0, dur: 2.9, rot: 25 },
              { left: '68%', delay: 0.2, dur: 2.7, rot: -30 },
              { left: '84%', delay: 0.4, dur: 2.5, rot: 50 },
            ].map((leaf, i) => (
              <motion.div
                key={i}
                initial={{ y: -60, opacity: 0, rotate: 0 }}
                animate={{
                  y: '105vh',
                  opacity: [0, 0.9, 0.9, 0],
                  rotate: leaf.rot * 3,
                }}
                transition={{
                  duration: leaf.dur,
                  delay: leaf.delay,
                  ease: 'easeInOut',
                }}
                style={{ left: leaf.left }}
                className="absolute top-0"
              >
                <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                  <path
                    d="M30 6C18 6 8 14 6 30C22 28 30 18 30 6Z"
                    fill="#D4A646"
                    fillOpacity="0.85"
                    stroke="#F6E29F"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M6 30C14 22 22 14 30 6"
                    stroke="#FFF4CC"
                    strokeWidth="1.2"
                  />
                </svg>
              </motion.div>
            ))}
          </div>

          {/* Center Card: Golden Leaf Transition + 6-Member Group Photo */}
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-3xl w-full bg-[#19281E]/95 border border-[#B6862C]/50 rounded-2xl p-5 sm:p-7 shadow-2xl text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#E7C675] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A646]" />
              <span>Golden Leaf Transition · Botanical Herbarium File Project</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif-display font-semibold text-[#FCFBF7] tracking-tight">
              The Golden Leaf Expedition
            </h1>

            {/* 6-Member Team Group Photo */}
            <div className="relative mx-auto max-w-xl aspect-[16/10] rounded-xl overflow-hidden border border-[#B6862C]/60 shadow-lg bg-[#0F1912]">
              <img
                src={teamPhotoUrl}
                alt="Six-member Golden Leaf Herbarium expedition team in the forest"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-black/65 text-[10px] font-mono-tabular uppercase tracking-widest text-[#F3E3B2] border border-white/15">
                Adventure · Truth · Together
              </div>
              <div className="absolute bottom-2.5 left-3 right-3 text-left">
                <div className="text-[11px] text-[#E7C675] font-medium">
                  Indore Botanical Field Survey · 6-Member Curatorial Team
                </div>
                <div className="text-xs text-white/95 truncate">
                  {TEAM_MEMBERS.map((m) => m.name).join(' · ')}
                </div>
              </div>
            </div>

            {/* 3-Second Golden Leaf Progress Bar & Immediate Enter Button */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B6862C] via-[#E7C675] to-[#B6862C] transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <button
                type="button"
                onClick={onComplete}
                className="px-4 py-1.5 text-xs font-medium bg-[#B6862C] hover:bg-[#C99738] text-white rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Enter Herbarium</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
