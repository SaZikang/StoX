import React from 'react';
import { motion } from 'framer-motion';

export function AnimatedMarketBackground({ isLight }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-35 z-0">
      <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 900">
        <defs>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="redGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background Grid Lines */}
        {[150, 300, 450, 600, 750].map((y, idx) => (
          <line key={idx} x1="0" y1={y} x2="1440" y2={y} stroke={isLight ? '#cbd5e1' : '#1e293b'} strokeWidth="1" strokeDasharray="5 5" opacity="0.3" />
        ))}

        {/* Green Bullish Trend Area & Line */}
        <motion.path
          d="M 0,550 Q 240,400 480,480 T 960,320 T 1440,200 L 1440,900 L 0,900 Z"
          fill="url(#greenGrad)"
          initial={{ y: 20, opacity: 0.2 }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 0,550 Q 240,400 480,480 T 960,320 T 1440,200"
          fill="none"
          stroke="#10b981"
          strokeWidth="3.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />

        {/* Red Bearish / Volatility Trend Line */}
        <motion.path
          d="M 0,280 Q 360,520 720,380 T 1440,520"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="3"
          strokeDasharray="6 6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, delay: 0.3, ease: "easeInOut" }}
        />

        {/* Floating Price Nodes / Badges */}
        <motion.g
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="480" cy="480" r="6" fill="#10b981" />
          <rect x="500" y="465" width="76" height="28" rx="6" fill="#10b981" fillOpacity="0.95" />
          <text x="538" y="483" fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">NVDA +5.2%</text>
        </motion.g>

        <motion.g
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="960" cy="320" r="6" fill="#10b981" />
          <rect x="980" y="305" width="76" height="28" rx="6" fill="#10b981" fillOpacity="0.95" />
          <text x="1018" y="323" fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">AAPL +3.4%</text>
        </motion.g>

        <motion.g
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="720" cy="380" r="6" fill="#f43f5e" />
          <rect x="740" y="365" width="76" height="28" rx="6" fill="#f43f5e" fillOpacity="0.95" />
          <text x="778" y="383" fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">TSLA -1.8%</text>
        </motion.g>
      </svg>
    </div>
  );
}
