import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function IntroSplash({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const playCinematicAudio = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        // Sub-bass impact thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(24, ctx.currentTime + 0.65);

        gain.gain.setValueAtTime(1.0, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.65);

        // Shimmer high frequency chime on X strike
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1200, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.5);

        gain2.gain.setValueAtTime(0.35, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.5);
      } catch (e) {
        // Audio ignored if blocked before user interaction
      }
    };

    const t1 = setTimeout(() => setStage(1), 350);   // "St" slides in
    const t2 = setTimeout(() => setStage(2), 950);   // "o" orbits & locks
    const t3 = setTimeout(() => {
      setStage(3);                                 // Red "X" strikes with shockwave ring
      playCinematicAudio();
    }, 1600);
    const t4 = setTimeout(() => setStage(4), 3600);  // Hold 2 full seconds with shimmer sweep
    const t5 = setTimeout(() => {
      onComplete();                                // Curtain open zoom-out to startup page
    }, 4400);

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
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: 'transform, opacity' }}
      className="fixed inset-0 z-[99999] bg-[#070a12] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Background Ambient Financial Grids & Glowing Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#070a12] to-[#070a12] pointer-events-none"></div>
      <div className="absolute w-[900px] h-[900px] bg-blue-500/10 blur-[180px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="relative flex items-center justify-center z-10">
        {/* Multi-Layer Shockwave Ring Burst on X impact */}
        <AnimatePresence>
          {stage >= 3 && (
            <>
              <motion.div
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: "easeOut" }}
                className="absolute w-64 h-64 rounded-full border-2 border-rose-500 pointer-events-none shadow-[0_0_60px_rgba(244,63,94,0.9)]"
              />
              <motion.div
                initial={{ scale: 0.1, opacity: 1 }}
                animate={{ scale: 2.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="absolute w-48 h-48 rounded-full border border-blue-400 pointer-events-none shadow-[0_0_40px_rgba(59,130,246,0.8)]"
              />
            </>
          )}
        </AnimatePresence>

        {/* Masterpiece Logo Container */}
        <div className="flex items-center text-8xl md:text-[12rem] font-black tracking-tight font-mono relative">
          {/* 'S' */}
          <motion.span
            initial={{ opacity: 0, x: -80, y: 20, filter: 'blur(12px)' }}
            animate={stage >= 1 ? { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-600 drop-shadow-[0_0_35px_rgba(59,130,246,0.6)]"
          >
            S
          </motion.span>

          {/* 't' */}
          <motion.span
            initial={{ opacity: 0, y: -60, filter: 'blur(12px)' }}
            animate={stage >= 1 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-blue-300 via-blue-500 to-cyan-500 drop-shadow-[0_0_35px_rgba(6,182,212,0.6)]"
          >
            t
          </motion.span>

          {/* 'o' with Orbit Spin */}
          <motion.span
            initial={{ opacity: 0, scale: 0.2, rotate: -180 }}
            animate={stage >= 2 ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 drop-shadow-[0_0_35px_rgba(59,130,246,0.6)]"
          >
            o
          </motion.span>

          {/* 'X' with Impact Punch */}
          <motion.span
            initial={{ opacity: 0, scale: 5, x: 120, filter: 'blur(20px)' }}
            animate={stage >= 3 ? { opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.25, type: "spring", stiffness: 450, damping: 18 }}
            className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-rose-400 via-rose-600 to-red-700 drop-shadow-[0_0_55px_rgba(244,63,94,1)] ml-3 relative"
          >
            X
          </motion.span>

          {/* Light Sweep Shimmer Overlay across Logo */}
          <AnimatePresence>
            {stage >= 3 && (
              <motion.div
                initial={{ x: '-150%', opacity: 0 }}
                animate={{ x: '200%', opacity: [0, 0.8, 0] }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none mix-blend-overlay"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Cinematic Tagline Badge */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={stage >= 3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-12 text-center z-10"
      >
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600/10 border border-blue-500/25 text-blue-400 font-mono text-xs font-bold uppercase tracking-[0.4em] shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Financial Intelligence Terminal</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
