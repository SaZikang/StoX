import React from 'react';
import { motion } from 'framer-motion';

export function AnimatedMarketBackground({ isLight }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 z-0">
      <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 900">
        <defs>
          <linearGradient id="greenArea" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="redArea" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid Lines */}
        {[180, 360, 540, 720].map((y, idx) => (
          <line
            key={idx}
            x1="0"
            y1={y}
            x2="1440"
            y2={y}
            stroke={isLight ? '#cbd5e1' : '#1e293b'}
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.25"
          />
        ))}

        {/* Bullish Green Area Fill (Straight segment zigzag chart breaking highs) */}
        <motion.path
          d="M 0,600 L 120,480 L 260,540 L 400,380 L 560,420 L 720,280 L 880,340 L 1040,200 L 1200,260 L 1440,140 L 1440,900 L 0,900 Z"
          fill="url(#greenArea)"
          initial={{ y: 15, opacity: 0.2 }}
          animate={{ y: [0, -15, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Bullish Green Main Line (Straight line segments breaking highs/lows) */}
        <motion.path
          d="M 0,600 L 120,480 L 260,540 L 400,380 L 560,420 L 720,280 L 880,340 L 1040,200 L 1200,260 L 1440,140"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />

        {/* Bearish Red Trend Line (Straight line segments breaking lower lows/highs) */}
        <motion.path
          d="M 0,300 L 180,420 L 340,360 L 520,520 L 680,450 L 860,600 L 1020,540 L 1220,680 L 1440,620"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="2.5"
          strokeDasharray="5 5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, delay: 0.4, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
