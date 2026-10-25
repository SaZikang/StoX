import React from 'react';
import { motion } from 'framer-motion';

export function StoXLogoAnimation({ className = "w-12 h-12", isLight = false }) {
  return (
    <div className={`relative flex items-center gap-3 select-none ${className}`}>
      {/* Abstract Financial Growth Symbol & Integrated Candlestick */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Minimalist Geometric Background Base / Container */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute inset-0 rounded-xl border ${
            isLight ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-white text-slate-950 shadow-lg'
          } flex items-center justify-center`}
        >
          {/* Integrated Minimalist Candlestick Chart Shape inside Symbol */}
          <div className="relative w-5 h-5 flex items-end justify-between gap-1">
            {/* Candle 1 (Subtle Red / Neutral) */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "60%" }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="w-1 bg-rose-500 rounded-full relative"
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-rose-500/60"></div>
            </motion.div>

            {/* Candle 2 (Electric Growth Green) */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="w-1.5 bg-emerald-500 rounded-full relative shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-emerald-400"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* StoX Wordmark with Refined Staggered Mask Reveal */}
      <div className="overflow-hidden flex items-baseline">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-baseline font-mono tracking-tight"
        >
          <span className={`text-xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Sto
          </span>
          <span className="text-xl font-black text-emerald-500 ml-0.5">
            X
          </span>
        </motion.div>
      </div>
    </div>
  );
}
