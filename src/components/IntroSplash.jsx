import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2 } from 'lucide-react';

export function IntroSplash({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const playCinematicAudio = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.6);

        gain.gain.setValueAtTime(0.9, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } catch (e) {
        // Audio ignored if blocked
      }
    };

    const t1 = setTimeout(() => setStage(1), 400);   // Bar chart icon pulses & morphs
    const t2 = setTimeout(() => setStage(2), 1100);  // Side bar sweeps open to reveal green Sto
    const t3 = setTimeout(() => {
      setStage(3);                                 // Red X impact strike
      playCinematicAudio();
    }, 1800);
    const t4 = setTimeout(() => setStage(4), 3800);  // Hold 2 full seconds
    const t5 = setTimeout(() => {
      onComplete();                                // Zoom out & reveal startup page
    }, 4500);

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
      animate={stage === 4 ? { scale: 3.2, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: 'transform, opacity' }}
      className="fixed inset-0 z-[99999] bg-[#070a12] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Background Ambient Financial Grids & Glowing Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/20 via-[#070a12] to-[#070a12] pointer-events-none"></div>
      <div className="absolute w-[900px] h-[900px] bg-emerald-500/10 blur-[180px] rounded-full pointer-events-none animate-pulse"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="relative flex items-center justify-center z-10">
        {/* Shockwave Ring Burst on X impact */}
        <AnimatePresence>
          {stage >= 3 && (
            <>
              <motion.div
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: 3.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute w-56 h-56 rounded-full border-2 border-rose-500 pointer-events-none shadow-[0_0_60px_rgba(244,63,94,0.9)]"
              />
              <motion.div
                initial={{ scale: 0.1, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
                className="absolute w-40 h-40 rounded-full border border-emerald-400 pointer-events-none shadow-[0_0_40px_rgba(16,185,129,0.8)]"
              />
            </>
          )}
        </AnimatePresence>

        {/* Stage 0-1: Glowing Barchart Icon Morphing into StoX */}
        <div className="relative flex items-center justify-center">
          {stage < 2 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
              animate={{ scale: [0.5, 1.2, 1], opacity: 1, rotate: 0 }}
              exit={{ scale: 0.2, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.4)]"
            >
              <BarChart2 className="w-20 h-20 text-emerald-400 animate-pulse" />
              <span className="mt-3 text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">StoX Systems</span>
            </motion.div>
          )}

          {/* Stage 2+: Side Bar Sweeping Open & StoX Wordmark Reveal */}
          {stage >= 2 && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 0.9] }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center text-8xl md:text-[12rem] font-black tracking-tight font-mono relative px-8 py-4"
            >
              {/* Bullish Green 'Sto' */}
              <motion.div
                initial={{ x: -60, opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                animate={{ x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center text-emerald-400 drop-shadow-[0_0_40px_rgba(16,185,129,0.7)]"
              >
                Sto
              </motion.div>

              {/* Red 'X' striking in with impact punch */}
              <motion.span
                initial={{ opacity: 0, scale: 5, x: 120, filter: 'blur(15px)' }}
                animate={stage >= 3 ? { opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.22, type: "spring", stiffness: 450, damping: 18 }}
                className="inline-block text-rose-500 drop-shadow-[0_0_55px_rgba(244,63,94,1)] ml-2 relative"
              >
                X
              </motion.span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Cinematic Tagline Badge */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={stage >= 2 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-12 text-center z-10"
      >
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-[0.4em] shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Financial Intelligence Terminal</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
