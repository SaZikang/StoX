---
name: StoX
description: "Bloomberg-meets-Robinhood financial terminal experience with professional charting and real-time insights"
colors:
  dark: "#0b0e14"
  card: "#131722"
  card-hover: "#1e222d"
  border: "#2a2e39"
  border-light: "#363c4e"
  accent: "#2962ff"
  accent-hover: "#1e48e8"
  green: "#00b42a"
  red: "#f53f3f"
  muted: "#848e9c"
  success: "#10B981"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.lg}"
    padding: "20px"
---

# Design System: StoX

## Overview

**Creative North Star: "The Bloomberg-meets-Robinhood Financial Terminal"**

StoX provides a sleek, sophisticated dark financial terminal experience where users can track top gainers/losers, high-growth stocks, search instruments, analyze multi-timeframe interactive price charts with drawing tools and technical indicators, and catch up on real-time stock news. 

The design combines advanced trading terminal capabilities with an ultra-clean, minimalist consumer interface. It features crisp typography, subtle neon gradient accents, and fluid interactions that eliminate cognitive friction while presenting complex financial data.

**Key Characteristics:**
- **Precision at Glance:** Key market movers and stock data immediately visible without clutter.
- **Advanced Depth:** Professional-grade charting, drawing tools, and technical indicators accessible instantly.
- **Fluid Simplicity:** Complex financial data presented with clean hierarchy and zero cognitive friction.

## Colors

The palette establishes a high-contrast dark trading environment anchored in deep charcoal and navy tones, energized by electric blue and clear financial status indicators.

### Primary
- **StoX Electric Blue** (#2962ff): Used for primary CTAs, active tab indicators, and interactive highlights.

### Neutral
- **Terminal Dark** (#0b0e14): Deep background surface for the entire application.
- **Card Background** (#131722): Elevated card and container surfaces.
- **Card Hover** (#1e222d): Interactive hover state for cards and rows.
- **Border** (#2a2e39): Structural borders separating panels and containers.
- **Muted Text** (#848e9c): Secondary descriptions, timestamps, and inactive labels.

### Status Indicators
- **Green** (#00b42a / #10B981): Positive price changes, gains, and success badges.
- **Red** (#f53f3f): Negative price changes and loss indicators.

### Named Rules
**The High Contrast Rule.** Dark terminal aesthetics must always maintain high legibility with stark contrast between background surfaces, data text, and status colors.

## Typography

**Display Font:** Inter (with system-ui, -apple-system, sans-serif)
**Body Font:** Inter (with system-ui, -apple-system, sans-serif)
**Mono Font:** JetBrains Mono, Fira Code, monospace

### Hierarchy
- **Display** (700, clamp(2rem, 5vw, 3.5rem), 1.1): Hero headlines and major market indices.
- **Headline** (600, 1.5rem, 1.25): Section titles and primary card headers.
- **Title** (600, 1.125rem, 1.4): Widget titles and stock tickers.
- **Body** (400, 0.875rem, 1.5): General descriptions and tabular data.
- **Label** (500, 0.75rem, 1.4, uppercase tracking-wider): Table column headers, badges, and metadata tags.

## Layout

StoX uses a responsive flex and grid spatial model built on Tailwind CSS. Containers feature comfortable padding (16px to 24px) with rounded corners (`rounded-lg` / 12px), organized into structured dashboard grids, sticky headers, and sidebars optimized for desktop and mobile monitoring.

## Elevation & Depth

StoX relies on tonal layering between `#0b0e14` (background), `#131722` (cards), and `#1e222d` (hover states), supplemented by subtle neon-tinted box shadows on hover (`0 20px 25px -5px rgba(88,101,242,0.08)`).

### Shadow Vocabulary
- **Card Hover Glow** (`0 20px 25px -5px rgba(88,101,242,0.08)`): Applied to interactive cards on hover to create a floating focal point.

## Shapes

Form language is clean, modern, and precise. Corner radii follow a consistent scale: `rounded-md` (8px) for buttons and inputs, and `rounded-lg` (12px) for cards and containers.

## Components

### Buttons
- **Shape:** Rounded rectangle (8px radius)
- **Primary:** Electric blue (`#2962ff`) background with white text, medium weight, 8px 16px padding.
- **Hover:** Darker blue (`#1e48e8`) with smooth 200ms transition.

### Cards / Containers
- **Corner Style:** Rounded (12px radius)
- **Background:** `#131722`
- **Border:** `#2a2e39` (1px solid)
- **Internal Padding:** 20px (`p-5`)

### Inputs / Fields
- **Style:** Dark background with subtle border (`#2a2e39`), 8px radius.
- **Focus:** Electric blue ring or border shift.

## Do's and Don'ts

### Do:
- **Do** maintain crisp typography and high contrast for financial data.
- **Do** use green for gains and red for losses consistently across all views.
- **Do** provide smooth transitions for interactive cards and charts.

### Don't:
- **Don't** clutter the trading terminal interface with unnecessary decorative ornamentation.
- **Don't** use low-contrast text for financial metrics and timestamps.
