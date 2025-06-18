import React from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Wifi, WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWA();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">Modo Offline</span>
    </div>
  );
}; 