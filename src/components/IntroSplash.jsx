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
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.6);

        gain.gain.setValueAtTime(0.9, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } catch (e) {
        // Audio ignored if blocked before user interaction
      }
    };

    const t1 = setTimeout(() => setStage(1), 300);   // Bullish green bar emerges out & sweeps open
    const t2 = setTimeout(() => {
      setStage(2);                                 // Red X strikes with shockwave ring
      playCinematicAudio();
    }, 1200);
    const t3 = setTimeout(() => setStage(3), 3200);  // Hold 2 full seconds
    const t4 = setTimeout(() => {
      onComplete();                                // Curtain open zoom-out to startup page
    }, 3900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      animate={stage === 3 ? { scale: 3.2, opacity: 0 } : { scale: 1, opacity: 1 }}
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
          {stage >= 2 && (
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

        {/* Dynamic Bar Emerge & Bullish Green Sto Reveal */}
        <div className="relative flex items-center justify-center">
          {/* Evolving Side Bar Sweeping Open */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={stage >= 1 ? { scaleX: 1, opacity: [0, 1, 0.8] } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0 h-full rounded-2xl blur-md pointer-events-none"
          />

          <div className="flex items-center text-8xl md:text-[12rem] font-black tracking-tight font-mono relative overflow-hidden px-8 py-4">
            {/* Bullish Green 'Sto' emerging fluidly as a bar sweeps open */}
            <motion.div
              initial={{ x: -100, opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
              animate={stage >= 1 ? { x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)' } : {}}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center text-emerald-400 drop-shadow-[0_0_40px_rgba(16,185,129,0.7)]"
            >
              Sto
            </motion.div>

            {/* Red 'X' striking in last with impact punch */}
            <motion.span
              initial={{ opacity: 0, scale: 5, x: 120, filter: 'blur(15px)' }}
              animate={stage >= 2 ? { opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.22, type: "spring", stiffness: 450, damping: 18 }}
              className="inline-block text-rose-500 drop-shadow-[0_0_55px_rgba(244,63,94,1)] ml-2 relative"
            >
              X
            </motion.span>
          </div>
        </div>
      </div>

      {/* Cinematic Tagline Badge */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={stage >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.3 }}
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
