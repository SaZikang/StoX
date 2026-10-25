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

        // Cinematic Low frequency punch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.6);

        gain.gain.setValueAtTime(1.0, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);

        // Ring burst high sparkle noise
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1000, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);

        gain2.gain.setValueAtTime(0.4, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.4);
      } catch (e) {
        // Audio ignored if blocked before user gesture
      }
    };

    const t1 = setTimeout(() => setStage(1), 400);   // S and t tumbling in tilted shot
    const t2 = setTimeout(() => setStage(2), 1100);  // Camera whips out, 'o' spins up
    const t3 = setTimeout(() => {
      setStage(3);                                 // Red X flies in with punch & ring burst
      playImpactSound();
    }, 1800);
    const t4 = setTimeout(() => setStage(4), 3800);  // Wait 2 full seconds after logo is fully displayed, then zoom out/disappear
    const t5 = setTimeout(() => {
      onComplete();                                // Reveal startup page
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
      animate={stage === 4 ? { scale: 3, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[99999] bg-[#0b0f19] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Background Radial Glow */}
      <div className="absolute w-[1000px] h-[1000px] bg-blue-600/25 blur-[200px] rounded-full pointer-events-none"></div>

      <div className="relative flex items-center justify-center">
        {/* Ring Burst Effect on X impact */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 3.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute w-56 h-56 rounded-full border-4 border-rose-500 pointer-events-none shadow-[0_0_50px_rgba(244,63,94,0.95)]"
            />
          )}
        </AnimatePresence>

        {/* Massive Netflix-style Center Logo with Dynamic Side-to-Side Spinning/Tilting */}
        <motion.div
          animate={stage >= 3 ? { rotateY: [0, 10, -10, 5, -5, 0], rotateX: [0, -5, 5, 0] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ perspective: 1000 }}
          className="flex items-center text-8xl md:text-[11rem] font-black tracking-tighter text-white font-mono relative"
        >
          {/* 'S' - Tumbles in from tilted close shot */}
          <motion.span
            initial={{ opacity: 0, rotateX: -90, rotateY: 60, z: -400, scale: 0.3 }}
            animate={stage >= 1 ? { opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block origin-bottom-left text-blue-500 drop-shadow-[0_0_35px_rgba(59,130,246,0.8)]"
          >
            S
          </motion.span>

          {/* 't' - Tumbles in */}
          <motion.span
            initial={{ opacity: 0, rotateX: 90, rotateY: -60, z: -400, scale: 0.3 }}
            animate={stage >= 1 ? { opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block origin-bottom text-blue-400"
          >
            t
          </motion.span>

          {/* 'o' - Spins up as camera whips to wider angle */}
          <motion.span
            initial={{ opacity: 0, scale: 0.1, rotate: -270 }}
            animate={stage >= 2 ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-blue-300"
          >
            o
          </motion.span>

          {/* 'X' - Red X flies in last with punch & ring burst */}
          <motion.span
            initial={{ opacity: 0, scale: 6, x: 200, y: -100, rotate: 90 }}
            animate={stage >= 3 ? { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 } : {}}
            transition={{ duration: 0.28, type: "spring", stiffness: 500, damping: 16 }}
            className="inline-block text-rose-500 drop-shadow-[0_0_50px_rgba(244,63,94,1)] ml-2 relative"
          >
            X
          </motion.span>
        </motion.div>
      </div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={stage >= 3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-12 text-center z-10"
      >
        <span className="text-sm md:text-base font-mono uppercase tracking-[0.4em] text-slate-200 font-bold bg-blue-600/15 px-6 py-2.5 rounded-full border border-blue-500/30 shadow-xl">
          Financial Intelligence Terminal
        </span>
      </motion.div>
    </motion.div>
  );
}
