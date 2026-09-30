import React from 'react';
import { usePwa } from '../context/PwaContext';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOffline } = usePwa();

  if (!isOffline) return null;

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-md animate-pulse">
      <WifiOff className="w-4 h-4" />
      <span>You're currently offline. Viewing cached LankaEase data.</span>
    </div>
  );
};
