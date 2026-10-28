import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function IntroSplash({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Phase 1: Candlesticks appear (0s - 1.4s)
    const t1 = setTimeout(() => setStage(1), 100);
    // Phase 2: Candlesticks fade out, light sweep and StoX logo reveal (1.4s - 4.0s)
    const t2 = setTimeout(() => setStage(2), 1400);
    // Phase 3: Final cinematic fade out (4.0s - 4.5s)
    const t3 = setTimeout(() => setStage(3), 4000);
    // Phase 4: Complete
    const t4 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={stage >= 3 ? { opacity: 0, scale: 1.05 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[99999] bg-[#030712] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Epic Cinematic Background Glow */}
      <div className="absolute w-[1000px] h-[1000px] bg-blue-600/20 blur-[200px] rounded-full pointer-events-none"></div>

      {/* Light Sweep Effect */}
      {stage >= 2 && (
        <motion.div
          initial={{ x: -900, opacity: 0 }}
          animate={{ x: 900, opacity: 0.9 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          className="absolute w-[200px] h-[1400px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent blur-[60px] rotate-[-35deg] pointer-events-none"
        />
      )}

      {/* 3 Sleek Candlesticks Appearing FIRST (0s - 1.4s) */}
      <AnimatePresence>
        {stage < 2 && (
          <motion.div
            initial={{ scaleY: 0.1, opacity: 0, y: 80 }}
            animate={{ scaleY: 1, opacity: 0.9, y: 0 }}
            exit={{ opacity: 0, scale: 1.15, transition: { duration: 0.4, ease: "easeInOut" } }}
            transition={{ duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] }}
            className="absolute inset-0 flex items-center justify-center gap-16 z-10"
          >
            {/* Candle 1 */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-1 bg-emerald-400 h-16"></div>
              <div className="w-8 bg-emerald-500 h-56 rounded-sm shadow-xl shadow-emerald-500/40 filter drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
              <div className="w-1 bg-emerald-400 h-16"></div>
            </div>
            {/* Candle 2 */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-1 bg-red-400 h-20"></div>
              <div className="w-8 bg-red-500 h-72 rounded-sm shadow-xl shadow-red-500/40 filter drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>
              <div className="w-1 bg-red-400 h-20"></div>
            </div>
            {/* Candle 3 */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-1 bg-emerald-400 h-24"></div>
              <div className="w-8 bg-emerald-500 h-80 rounded-sm shadow-xl shadow-emerald-500/40 filter drop-shadow-[0_0_25px_rgba(16,185,129,0.6)]"></div>
              <div className="w-1 bg-emerald-400 h-24"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Epic Floating Typography Appearing AFTER Candlesticks (1.4s - 4.5s) */}
      {stage >= 2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="flex items-baseline font-mono tracking-tighter text-[100px] md:text-[160px] font-black select-none">
            <motion.span
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.175, 0.885, 0.32, 1.275] }}
              className="text-white filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              S
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.175, 0.885, 0.32, 1.275] }}
              className="text-white filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              t
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
              className="text-white filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              o
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 60, scale: 1.25 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="text-blue-400 ml-6 filter drop-shadow-[0_0_50px_rgba(59,130,246,0.9)]"
            >
              X
            </motion.span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="text-lg md:text-3xl font-mono text-white uppercase tracking-[0.5em] mt-6 font-bold"
          >
            INSTITUTIONAL QUANTITATIVE TERMINAL
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
