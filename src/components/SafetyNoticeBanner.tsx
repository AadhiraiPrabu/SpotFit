import React, { useState } from 'react';
import { ShieldCheck, Info, X, AlertTriangle } from 'lucide-react';

export const SafetyNoticeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3 sm:p-4 text-xs text-slate-300 flex items-start justify-between gap-3 shadow-sm">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-400">The SpotFit Principle: </span>
            You can specifically train, strengthen, and hypertrophy any targeted muscle group, but exercise cannot guarantee that body fat will be lost only from that specific spot.
            <button
              onClick={() => setShowModal(true)}
              className="text-amber-400 underline hover:text-amber-300 ml-1 font-semibold"
            >
              Learn why
            </button>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-500 hover:text-white p-0.5"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-fade-in space-y-4">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 text-amber-400">
              <Info className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">
                Spot Training vs. Spot Fat Reduction
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                Scientific exercise physiology demonstrates that working a specific muscle group recruits motor units, increases local blood flow, and builds strength and density in those exact fibers.
              </p>
              <p>
                However, when your body mobilizes stored adipose tissue (body fat) for energy, it draws fat systemically from fat stores across your entire body through hormonal signaling, rather than drawing solely from the muscles you are exercising.
              </p>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                <span className="font-bold text-amber-400 block mb-1">Our Commitment:</span>
                SpotFit empowers you to build strength, correct muscular imbalances, tone definition, and improve posture in the exact spots you care about—without false claims or gimmicks.
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors"
            >
              UNDERSTOOD · TRAIN WITH PURPOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
};
