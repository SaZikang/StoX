import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function IntroSplash({ onComplete }) {
  const [stage, setStage] = useState(0); // 0: Start, 1: St tumbling, 2: o spin & zoom out, 3: Red X punch & ring burst, 4: Finish zoom & fade out

  useEffect(() => {
    // Play cinematic impact sound via Web Audio API when red X hits (at ~1.2s)
    const playImpactSound = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        // Low frequency punch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.8, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);

        // Ring burst high sparkle noise
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(800, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

        gain2.gain.setValueAtTime(0.3, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.3);
      } catch (e) {
        // Audio not allowed before user gesture or unsupported
      }
    };

    const t1 = setTimeout(() => setStage(1), 300);   // S and t tumbling in tilted shot
    const t2 = setTimeout(() => setStage(2), 800);   // Camera whips out, 'o' spins up
    const t3 = setTimeout(() => {
      setStage(3);                                 // Red X flies in with punch & ring burst
      playImpactSound();
    }, 1300);
    const t4 = setTimeout(() => setStage(4), 2200);  // Quick close-up, light sweep & finish
    const t5 = setTimeout(() => {
      onComplete();                                // Enlarge until gone, reveal startup page
    }, 2900);

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
      animate={stage === 4 ? { scale: 2.2, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-[#0b0f19] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Background Radial Glow */}
      <div className="absolute w-[800px] h-[800px] bg-blue-600/15 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="relative flex items-center justify-center scale-125 md:scale-150">
        {/* Ring Burst Effect on X impact */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute w-36 h-36 rounded-full border-4 border-rose-500 pointer-events-none shadow-[0_0_30px_rgba(244,63,94,0.8)]"
            />
          )}
        </AnimatePresence>

        {/* Logo Letters Container with 3D perspective / tilted start */}
        <div className="flex items-center text-6xl md:text-8xl font-black tracking-tighter text-white font-mono relative">
          {/* 'S' - Flips and tumbles into place from tilted close shot */}
          <motion.span
            initial={{ opacity: 0, rotateX: -90, rotateY: 45, z: -200, scale: 0.5 }}
            animate={stage >= 1 ? { opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block origin-bottom-left text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]"
          >
            S
          </motion.span>

          {/* 't' - Flips and tumbles */}
          <motion.span
            initial={{ opacity: 0, rotateX: 90, rotateY: -45, z: -200, scale: 0.5 }}
            animate={stage >= 1 ? { opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block origin-bottom text-blue-400"
          >
            t
          </motion.span>

          {/* 'o' - Spins up as camera whips to wider angle */}
          <motion.span
            initial={{ opacity: 0, scale: 0.2, rotate: -180 }}
            animate={stage >= 2 ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-blue-300"
          >
            o
          </motion.span>

          {/* 'X' - Red X flies in last with punch & ring burst */}
          <motion.span
            initial={{ opacity: 0, scale: 4, x: 120, y: -60, rotate: 45 }}
            animate={stage >= 3 ? { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 } : {}}
            transition={{ duration: 0.25, type: "spring", stiffness: 400, damping: 20 }}
            className="inline-block text-rose-500 drop-shadow-[0_0_35px_rgba(244,63,94,0.9)] ml-0.5 relative"
          >
            X
          </motion.span>
        </div>
      </div>

      {/* Tagline with light sweep finish */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={stage >= 3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-8 text-center"
      >
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-slate-400 font-bold">
          Financial Intelligence Terminal
        </span>
      </motion.div>
    </motion.div>
  );
}
