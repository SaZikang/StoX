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

        // Low frequency punch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.45);

        gain.gain.setValueAtTime(0.9, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);

        // Ring burst high sparkle noise
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(900, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.35);

        gain2.gain.setValueAtTime(0.35, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.35);
      } catch (e) {
        // Audio ignored if blocked before user gesture
      }
    };

    const t1 = setTimeout(() => setStage(1), 350);   // S and t tumbling in tilted shot
    const t2 = setTimeout(() => setStage(2), 900);   // Camera whips out, 'o' spins up
    const t3 = setTimeout(() => {
      setStage(3);                                 // Red X flies in with punch & ring burst
      playImpactSound();
    }, 1400);
    const t4 = setTimeout(() => setStage(4), 2300);  // Quick close-up, light sweep & finish
    const t5 = setTimeout(() => {
      onComplete();                                // Enlarge until gone, reveal startup page
    }, 3000);

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
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[99999] bg-[#0b0f19] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Background Radial Glow */}
      <div className="absolute w-[900px] h-[900px] bg-blue-600/20 blur-[180px] rounded-full pointer-events-none"></div>

      <div className="relative flex items-center justify-center">
        {/* Ring Burst Effect on X impact */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="absolute w-48 h-48 rounded-full border-4 border-rose-500 pointer-events-none shadow-[0_0_40px_rgba(244,63,94,0.9)]"
            />
          )}
        </AnimatePresence>

        {/* Netflix-style Large Center Logo Animation */}
        <div className="flex items-center text-7xl md:text-9xl font-black tracking-tighter text-white font-mono relative">
          {/* 'S' - Tumbles in from tilted close shot */}
          <motion.span
            initial={{ opacity: 0, rotateX: -90, rotateY: 50, z: -300, scale: 0.4 }}
            animate={stage >= 1 ? { opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1 } : {}}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block origin-bottom-left text-blue-500 drop-shadow-[0_0_25px_rgba(59,130,246,0.7)]"
          >
            S
          </motion.span>

          {/* 't' - Tumbles in */}
          <motion.span
            initial={{ opacity: 0, rotateX: 90, rotateY: -50, z: -300, scale: 0.4 }}
            animate={stage >= 1 ? { opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block origin-bottom text-blue-400"
          >
            t
          </motion.span>

          {/* 'o' - Spins up as camera whips to wider angle */}
          <motion.span
            initial={{ opacity: 0, scale: 0.2, rotate: -180 }}
            animate={stage >= 2 ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-blue-300"
          >
            o
          </motion.span>

          {/* 'X' - Red X flies in last with punch & ring burst */}
          <motion.span
            initial={{ opacity: 0, scale: 5, x: 150, y: -80, rotate: 60 }}
            animate={stage >= 3 ? { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 } : {}}
            transition={{ duration: 0.25, type: "spring", stiffness: 450, damping: 18 }}
            className="inline-block text-rose-500 drop-shadow-[0_0_40px_rgba(244,63,94,0.95)] ml-1 relative"
          >
            X
          </motion.span>
        </div>
      </div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={stage >= 3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-10 text-center z-10"
      >
        <span className="text-xs md:text-sm font-mono uppercase tracking-[0.35em] text-slate-300 font-bold bg-blue-600/10 px-4 py-2 rounded-full border border-blue-500/20 shadow-inner">
          Financial Intelligence Terminal
        </span>
      </motion.div>
    </motion.div>
  );
}
