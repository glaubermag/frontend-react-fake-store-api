import React, { useEffect, useState } from 'react';
import { usePWA } from '@/hooks/usePWA';

export const PWASplashScreen: React.FC = () => {
  const { isStandalone } = usePWA();
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (isStandalone) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isStandalone]);

  if (!showSplash) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-lg">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Fake Store</h1>
        <p className="text-blue-100">Carregando...</p>
        <div className="mt-6">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
}; 