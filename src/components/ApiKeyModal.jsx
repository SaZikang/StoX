import React, { useState } from 'react';
import { Key, Check, X, Shield, ExternalLink } from 'lucide-react';

export function ApiKeyModal({ isOpen, onClose, apiKey, setApiKey }) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const trimmed = inputKey.trim();
    setApiKey(trimmed);
    localStorage.setItem('stox_alphavantage_key', trimmed);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-stox-card border border-stox-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Alpha Vantage API Key</h3>
            <p className="text-xs text-slate-400">Connect live global quotes & sentiment data</p>
          </div>
        </div>

        {saved ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div className="text-base font-bold text-emerald-400">API Key Saved Successfully!</div>
            <p className="text-xs text-slate-400">StoX is now fetching live market prices from Alpha Vantage.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase">Enter Alpha Vantage API Key</label>
              <input
                type="password"
                placeholder="e.g. DEMO or your key (free at alphavantage.co)"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full bg-stox-dark border border-stox-border rounded-xl px-4 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                Get a free API key instantly at{' '}
                <a
                  href="https://www.alphavantage.co/support/#api-key"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  alphavantage.co <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>

            <div className="bg-stox-dark p-3.5 rounded-xl border border-stox-border text-xs text-slate-400 space-y-1.5">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" /> Secure Storage
              </div>
              <p>Your API key is stored securely in your browser's localStorage and is sent directly to Alpha Vantage for live global quotes.</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all"
            >
              Save & Activate Alpha Vantage Feed
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
