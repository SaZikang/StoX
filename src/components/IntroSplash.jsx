import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function IntroSplash({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 200);   // Bar emerges
    const t2 = setTimeout(() => setStage(2), 900);   // StoX text sweeps open
    const t3 = setTimeout(() => setStage(3), 2000);  // Fade out / complete
    const t4 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);

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
      className="fixed inset-0 z-[99999] bg-[#0b0f19] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Background ambient glow */}
      <div className="absolute w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative flex items-center gap-5 z-10">
        {/* Minimalist Candlestick Icon Box */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden"
        >
          {/* Subtle Candlestick Chart */}
          <div className="relative w-6 h-6 flex items-end justify-around gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "65%" }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              className="w-1 bg-rose-500 rounded-full relative"
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-rose-400"></div>
            </motion.div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="w-1.5 bg-emerald-500 rounded-full relative shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-emerald-400"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Side bar emerging out and revealing StoX */}
        <div className="relative overflow-hidden flex items-baseline">
          {/* Emerging background bar / clip */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-blue-600/15 rounded-xl -inset-x-2 -inset-y-1 pointer-events-none"
          />

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-baseline font-mono tracking-tight text-4xl md:text-5xl font-extrabold px-2 py-1 relative z-10"
          >
            <span className="text-white">Sto</span>
            <span className="text-emerald-500 ml-0.5 font-black">X</span>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6 text-xs font-mono uppercase tracking-[0.3em] text-slate-400 font-semibold"
      >
        Precision Financial Intelligence
      </motion.div>
    </motion.div>
  );
}
