"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { GravityStars } from "./gravity-stars";

export function GlyphPortal({
  word = "StoX",
  fontFamily = "system-ui, sans-serif",
  fontWeight = 700,
  children,
  onEnter,
}) {
  const containerRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    const handleWheel = (e) => {
      if (showLanding || isTransitioning) return;
      if (e.deltaY > 10) {
        setIsTransitioning(true);
        setTimeout(() => {
          setShowLanding(true);
          if (onEnter) onEnter();
        }, 700);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (showLanding || isTransitioning) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (deltaY > 30) {
        setIsTransitioning(true);
        setTimeout(() => {
          setShowLanding(true);
          if (onEnter) onEnter();
        }, 700);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [showLanding, isTransitioning]);

  const scale = isTransitioning ? 50 : 1;
  const rotateZ = isTransitioning ? 35 : 0;
  const rotateX = isTransitioning ? 20 : 0;
  const opacity = isTransitioning ? 0 : 1;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        background: isTransitioning ? "#07090f" : "#ffffff",
        fontFamily,
        color: "#07090f",
        perspective: "1200px",
        transition: "background 0.5s ease-in-out",
      }}
      className="select-none"
    >
      {!showLanding ? (
        <div
          onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setShowLanding(true);
              if (onEnter) onEnter();
            }, 700);
          }}
          className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden cursor-pointer"
        >
          {/* Floating Gravity Stars background for the light intro theme */}
          <GravityStars
            color="rgba(37, 99, 235, 0.35)"
            count={180}
            className="absolute inset-0 z-0 pointer-events-none opacity-80"
          />

          {/* Centered StoX Logo + Subtitle + Direction Prompt */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center transition-all duration-600"
            style={{
              transform: `scale(${scale}) rotateZ(${rotateZ}deg) rotateX(${rotateX}deg)`,
              transformStyle: "preserve-3d",
              opacity,
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-in-out",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(6rem, 18vw, 20rem)",
                fontWeight,
                letterSpacing: "-0.06em",
                lineHeight: 1,
              }}
              className="text-[#07090f] select-none font-black drop-shadow-[0_20px_40px_rgba(37,99,235,0.15)] mb-4"
            >
              {word}
            </h1>

            <p className="text-slate-600 font-mono text-sm md:text-base tracking-wide max-w-md mx-auto mb-10 font-medium">
              Institutional quantitative terminal &amp; real-time asset intelligence.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-bold uppercase tracking-widest animate-bounce">
              <span>Scroll to see more</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-30 w-full min-h-screen animate-fadeIn bg-[#07090f]">
          {children}
        </div>
      )}
    </div>
  );
}

export default GlyphPortal;
