import React from 'react';
import { usePwa } from '../context/PwaContext';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PwaInstallBanner: React.FC = () => {
  const { showInstallBanner, installApp, dismissInstallPrompt } = usePwa();

  return (
    <AnimatePresence>
      {showInstallBanner && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-96 bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 p-4 rounded-2xl shadow-xl z-50 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
            LE
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Install LankaEase</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Get faster access right from your phone.</p>
          </div>
          <button
            onClick={installApp}
            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </button>
          <button
            onClick={dismissInstallPrompt}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
