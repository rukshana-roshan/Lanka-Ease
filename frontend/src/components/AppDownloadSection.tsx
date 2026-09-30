import React, { useState } from 'react';
import { Smartphone, QrCode, Download, X } from 'lucide-react';

export const AppDownloadSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleDownloadApk = () => {
    const link = document.createElement('a');
    link.href = '/downloads/LankaEase-v2.4.apk';
    link.download = 'LankaEase-v2.4.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <section className="py-8 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0b241f] dark:bg-slate-900 border border-emerald-900/80 rounded-2xl md:rounded-3xl p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            {/* Left Content */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  INSTALL THE APP
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  Get faster access from your phone.
                </h3>
                <p className="text-xs text-slate-300">
                  Install LankaEase and enjoy a smoother, faster experience.
                </p>
              </div>
            </div>

            {/* Right Action Buttons: App Store, Google Play & QR code */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {/* App Store button */}
              <button
                onClick={handleDownloadApk}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-700 shadow flex items-center gap-2 transition-all"
              >
                <div className="text-[10px] text-left leading-tight">
                  <span className="text-slate-400 block text-[9px]">Download on the</span>
                  <strong className="text-xs font-bold text-white">App Store</strong>
                </div>
              </button>

              {/* Google Play button */}
              <button
                onClick={handleDownloadApk}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-700 shadow flex items-center gap-2 transition-all"
              >
                <div className="text-[10px] text-left leading-tight">
                  <span className="text-slate-400 block text-[9px]">GET IT ON</span>
                  <strong className="text-xs font-bold text-white">Google Play</strong>
                </div>
              </button>

              {/* QR Code button box */}
              <button
                onClick={() => setShowModal(true)}
                className="p-2 bg-white text-slate-900 rounded-xl shadow border border-slate-200 flex items-center justify-center"
                title="Scan QR code"
              >
                <QrCode className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* App Download Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full text-white space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-emerald-400 flex items-center justify-center mx-auto border border-zinc-700">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Download LankaEase Mobile</h3>
              <p className="text-xs text-zinc-400">Scan QR code or click below to install on Android & iOS</p>
            </div>

            {/* Simulated QR code box */}
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <span className="text-[11px] text-zinc-400">Scan with your smartphone camera</span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => { handleDownloadApk(); setShowModal(false); }}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl border border-zinc-700 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Direct Download APK (LankaEase-v2.4.apk)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
