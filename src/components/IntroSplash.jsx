import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function IntroSplash({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const playImpactSound = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.8, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch (e) {
        // Audio ignored if blocked
      }
    };

    const t1 = setTimeout(() => setStage(1), 300);   // S and t slide in
    const t2 = setTimeout(() => setStage(2), 800);   // o scales up
    const t3 = setTimeout(() => {
      setStage(3);                                 // Red X punches in
      playImpactSound();
    }, 1300);
    const t4 = setTimeout(() => setStage(4), 3300);  // Hold 2s, then zoom out
    const t5 = setTimeout(() => {
      onComplete();                                // Complete and reveal startup page
    }, 3900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      animate={stage === 4 ? { scale: 2.5, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: transform => 'transform, opacity' }}
      className="fixed inset-0 z-[99999] bg-[#0b0f19] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Background Radial Glow */}
      <div className="absolute w-[800px] h-[800px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative flex items-center justify-center">
        {/* Ring Burst Effect on X impact */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute w-48 h-48 rounded-full border-4 border-rose-500 pointer-events-none shadow-[0_0_40px_rgba(244,63,94,0.9)]"
            />
          )}
        </AnimatePresence>

        {/* Smooth GPU-Accelerated Logo Animation */}
        <div className="flex items-center text-7xl md:text-9xl font-black tracking-tighter text-white font-mono relative">
          {/* 'S' */}
          <motion.span
            initial={{ opacity: 0, x: -60, scale: 0.8 }}
            animate={stage >= 1 ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-blue-500 drop-shadow-[0_0_25px_rgba(59,130,246,0.7)]"
          >
            S
          </motion.span>

          {/* 't' */}
          <motion.span
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={stage >= 1 ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-blue-400"
          >
            t
          </motion.span>

          {/* 'o' */}
          <motion.span
            initial={{ opacity: 0, scale: 0.3, rotate: -90 }}
            animate={stage >= 2 ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-blue-300"
          >
            o
          </motion.span>

          {/* 'X' */}
          <motion.span
            initial={{ opacity: 0, scale: 4, x: 80 }}
            animate={stage >= 3 ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 0.22, type: "spring", stiffness: 350, damping: 20 }}
            className="inline-block text-rose-500 drop-shadow-[0_0_40px_rgba(244,63,94,0.95)] ml-2 relative"
          >
            X
          </motion.span>
        </div>
      </div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={stage >= 3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mt-10 text-center z-10"
      >
        <span className="text-xs md:text-sm font-mono uppercase tracking-[0.35em] text-slate-300 font-bold bg-blue-600/15 px-5 py-2 rounded-full border border-blue-500/30 shadow-lg">
          Financial Intelligence Terminal
        </span>
      </motion.div>
    </motion.div>
  );
}
