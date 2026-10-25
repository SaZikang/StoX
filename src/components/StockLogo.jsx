import React, { useState } from 'react';

export function StockLogo({ symbol, className = "w-9 h-9", theme = 'dark' }) {
  const [imgError, setImgError] = useState(false);
  const isLight = theme === 'light';

  const cleanSymbol = (symbol || '').toUpperCase();
  const logoUrl = `https://assets.parqet.com/logos/symbol/${encodeURIComponent(cleanSymbol)}?format=png`;

  if (imgError) {
    return (
      <div
        role="img"
        aria-label={`${cleanSymbol} company logo unavailable`}
        className={`${className} rounded-xl ${isLight ? 'bg-white border border-white shadow-lg shadow-slate-300/70' : 'bg-stox-dark border border-stox-border shadow-inner'}`}
      />
    );
  }

  return (
    <div className={`${className} rounded-xl ${isLight ? 'bg-white border border-white shadow-lg shadow-slate-300/70' : 'bg-stox-dark border border-stox-border bg-white/5'} flex items-center justify-center overflow-hidden p-1.5`}>
      <img
        src={logoUrl}
        alt={`${cleanSymbol} company logo`}
        className="w-full h-full object-contain"
        loading="lazy"
        decoding="async"
        onError={() => setImgError(true)}
      />
    </div>
  );
}
