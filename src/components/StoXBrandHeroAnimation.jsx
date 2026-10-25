import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function StoXBrandHeroAnimation({ onComplete }) {
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationFinished(true);
      if (onComplete) onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative flex flex-col items-center justify-center py-12 px-6 select-none">
      {/* 1. Opening: Uncluttered dark background with subtle fading geometric grid points */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.2, 1] }}
            transition={{ duration: 2.2, delay: i * 0.2, ease: "easeInOut" }}
            className="absolute w-32 h-32 rounded-full border border-slate-700/50"
          />
        ))}
      </div>

      <div className="relative flex items-center gap-5 z-10">
        {/* 2. Symbol Formation & 3. Candlestick Details */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Minimal geometric background container */}
          <motion.div
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden"
          >
            {/* Subtle internal geometric vector line */}
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
              className="absolute inset-2 border border-slate-700/40 rounded-xl pointer-events-none"
            />

            {/* Two or three tiny, elegant candlestick chart elements */}
            <div className="relative w-8 h-8 flex items-end justify-around gap-1.5 px-1 pb-1">
              {/* Candle 1: Muted Red Accent */}
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                className="w-1 bg-rose-500/80 rounded-full relative origin-bottom"
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-rose-400/80"></div>
              </motion.div>

              {/* Candle 2: Neutral Base */}
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                className="w-1 bg-slate-400 rounded-full relative origin-bottom"
              >
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-slate-300"></div>
              </motion.div>

              {/* Candle 3: Restrained Electric Green Accent for Growth */}
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                className="w-1.5 bg-emerald-500 rounded-full relative origin-bottom shadow-[0_0_10px_rgba(16,185,129,0.4)]"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[1px] h-5 bg-emerald-400"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* 4. Wordmark Reveal: Refined motion effect for 'StoX' */}
        <div className="overflow-hidden flex items-baseline">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-baseline font-mono tracking-tight text-4xl md:text-5xl font-extrabold"
          >
            <span className="text-white">Sto</span>
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
              className="text-emerald-500 ml-0.5 font-black"
            >
              X
            </motion.span>
          </motion.div>
        </div>
      </div>

      {/* 5. Final Composition / Subtitle Tagline */}
      <motion.motion
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
        className="mt-4 text-xs font-mono uppercase tracking-[0.3em] text-slate-400 font-semibold"
      >
        Precision Financial Intelligence
      </motion.motion>
    </div>
  );
}
