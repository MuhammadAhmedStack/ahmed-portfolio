import React, { useState } from 'react';
import { Mic, CheckCircle2, Sparkles, Database, ShoppingCart } from 'lucide-react';

interface ProjectDeviceMockupProps {
  projectId: string;
  accentColor: string;
}

export const ProjectDeviceMockup: React.FC<ProjectDeviceMockupProps> = ({ projectId, accentColor }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageSrc = `/images/${projectId}.webp`;

  return (
    <div className="relative w-full max-w-[min(100%,280px)] sm:max-w-[340px] lg:max-w-[380px] xl:max-w-[420px] aspect-[9/16] sm:aspect-[4/5] mx-auto flex items-center justify-center will-change-transform group">
      {/* Dynamic Ambient Aura */}
      <div
        className="absolute -inset-6 rounded-[2.5rem] blur-3xl opacity-20 pointer-events-none -z-10 transition-opacity duration-500 group-hover:opacity-35"
        style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
      />

      {/* Device Frame */}
      <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/[0.12] bg-[#0A0A0A] shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col justify-between">
        
        {/* Device Top Speaker & Status Bar */}
        <div className="w-full pt-3 px-6 pb-2 flex items-center justify-between text-[10px] font-mono text-[#737373] border-b border-white/[0.04] bg-[#050505]/80 backdrop-blur-sm z-20">
          <span>9:41</span>
          <div className="w-16 h-3.5 bg-black rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
          </div>
          <span className="text-emerald-400">5G · 100%</span>
        </div>

        {/* Real Screenshot Image Slot (Attempts to load /images/{projectId}.webp) */}
        <img
          src={imageSrc}
          alt={`${projectId} preview`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500 ${
            imageLoaded && !imageError ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* High-Fidelity UI Simulation Fallback (Displayed when image is not yet provided) */}
        {(!imageLoaded || imageError) && (
          <div className="relative w-full h-full p-5 sm:p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0e0e0e] via-[#080808] to-[#050505]">
            
            {/* Subtle App Background Grid */}
            <div className="absolute inset-0 bg-subtle-grid opacity-20 pointer-events-none" />

            {/* PAKAWNOW SIMULATION */}
            {projectId === 'pakawnow' && (
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  {/* App Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="font-display font-bold text-sm tracking-wider text-white">PAKAWNOW</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      OFFLINE ENGINE ACTIVE
                    </span>
                  </div>

                  {/* Budget Card */}
                  <div className="p-4 rounded-xl bg-[#121212] border border-white/[0.08] mb-4">
                    <div className="flex justify-between items-center text-xs font-mono text-[#8A8A8A] mb-1">
                      <span>MONTHLY GROCERY BUDGET</span>
                      <span className="text-white font-bold">Rs. 18,500</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div className="w-2/3 h-full bg-gradient-to-r from-emerald-500 to-emerald-300" />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-[#737373]">
                      <span>Spent: Rs. 12,200</span>
                      <span className="text-emerald-400">Remaining: Rs. 6,300</span>
                    </div>
                  </div>

                  {/* AI Recipe Rescue Banner */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/[0.12] to-white/[0.02] border border-emerald-500/30 mb-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="font-semibold">PANTRY GENIUS · GEMINI 2.0</span>
                    </div>
                    <div className="text-xs text-[#E5E5E5] font-medium">3 Expiry-Rescue Meals Generated</div>
                    <div className="text-[10px] font-mono text-[#8A8A8A] mt-1">Uses tomatoes, chicken & pasta expiring in 48h</div>
                  </div>

                  {/* Smart Grocery List Preview */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono text-[#8A8A8A] tracking-wider">SMART GROCERY LIST (EST. PKR)</div>
                    <div className="p-2.5 rounded-lg bg-[#141414] border border-white/[0.04] flex items-center justify-between text-xs">
                      <span className="text-white">Basmati Rice (5kg)</span>
                      <span className="font-mono text-emerald-400">Rs. 1,450</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#141414] border border-white/[0.04] flex items-center justify-between text-xs">
                      <span className="text-white">Olive Oil (1L)</span>
                      <span className="font-mono text-emerald-400">Rs. 2,100</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#737373]">
                  <span>Fuzzy Price Engine</span>
                  <span className="text-emerald-400">JSON Schema Validated</span>
                </div>
              </div>
            )}

            {/* AWAAZ KHATA SIMULATION */}
            {projectId === 'awaaz-khata' && (
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  {/* App Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <Mic className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="font-display font-bold text-sm tracking-wider text-white">AWAAZ KHATA</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      URDU VOICE READY
                    </span>
                  </div>

                  {/* Active Voice Waveform Recording Card */}
                  <div className="p-4 rounded-xl bg-[#121212] border border-emerald-500/30 mb-4 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        RECORDING AUDIO
                      </span>
                      <span className="text-[10px] font-mono text-[#8A8A8A]">00:03</span>
                    </div>

                    {/* Urdu Voice Waveform simulation */}
                    <div className="flex items-center justify-center gap-1 py-3">
                      {[40, 70, 30, 90, 60, 100, 45, 80, 50, 65, 35].map((height, i) => (
                        <div
                          key={i}
                          className="w-1 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-full animate-pulse"
                          style={{ height: `${height}%`, animationDelay: `${i * 80}ms` }}
                        />
                      ))}
                    </div>

                    {/* Urdu Transcription */}
                    <div className="text-right text-xs font-semibold text-emerald-300 font-sans tracking-wide pt-1">
                      "اصغر کریانہ - ادھار 1500 روپے"
                    </div>
                  </div>

                  {/* Confirmation Dialog Card */}
                  <div className="p-3.5 rounded-xl bg-[#141414] border border-white/[0.08] mb-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#8A8A8A] mb-2">
                      <span>CONFIRM ENTRY</span>
                      <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" />
                        INTERPRETED
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm font-semibold text-white mb-1">
                      <span>Asghar Kiryana Store</span>
                      <span className="text-rose-400 font-mono">+Rs. 1,500 (Udhaar)</span>
                    </div>

                    <div className="flex gap-2 mt-3 pt-2 border-t border-white/[0.06]">
                      <button className="flex-1 py-1 rounded bg-white/5 text-[10px] font-mono text-[#8A8A8A]">
                        CANCEL
                      </button>
                      <button className="flex-1 py-1 rounded bg-emerald-500 text-black text-[10px] font-mono font-bold">
                        CONFIRM RECORD
                      </button>
                    </div>
                  </div>

                  {/* Ledger Balance Summary */}
                  <div className="p-2.5 rounded-lg bg-[#0e0e0e] border border-white/[0.04] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8A8A8A]">Total Shopkeeper Ledger</span>
                    <span className="text-white font-bold">Rs. 48,200</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#737373]">
                  <span className="flex items-center gap-1">
                    <Database className="w-3 h-3 text-emerald-400" />
                    <span>Supabase RLS Protected</span>
                  </span>
                  <span>Confirmation-First</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Device Bottom Indicator Bar */}
        <div className="w-full pb-2 pt-1 flex justify-center bg-[#050505]/80 backdrop-blur-sm z-20">
          <div className="w-24 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};
