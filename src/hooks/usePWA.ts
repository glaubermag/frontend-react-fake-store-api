import { useState, useEffect } from 'react';

interface PWAState {
  isInstalled: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  canInstall: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isStandalone: false,
    isOnline: navigator.onLine,
    hasUpdate: false,
    canInstall: false,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Verificar se o app está em modo standalone (instalado)
    const checkStandalone = () => {
      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      
      setPwaState(prev => ({ ...prev, isStandalone, isInstalled: isStandalone }));
    };

    // Verificar conectividade
    const handleOnline = () => setPwaState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaState(prev => ({ ...prev, isOnline: false }));

    // Capturar evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPwaState(prev => ({ ...prev, canInstall: true }));
    };

    const handleAppInstalled = () => {
      setPwaState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        canInstall: false 
      }));
      setDeferredPrompt(null);
    };

    // Verificar atualizações do service worker
    const handleUpdateFound = () => {
      setPwaState(prev => ({ ...prev, hasUpdate: true }));
    };

    // Verificar se o service worker está ativo
    const checkServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            registration.addEventListener('updatefound', handleUpdateFound);
          }
        } catch (error) {
          console.error('Erro ao verificar service worker:', error);
        }
      }
    };

    // Inicializar verificações
    checkStandalone();
    checkServiceWorker();

    // Adicionar event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setPwaState(prev => ({ ...prev, canInstall: false }));
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao instalar app:', error);
      return false;
    }
  };

  const updateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    }
    window.location.reload();
  };

  const clearUpdateFlag = () => {
    setPwaState(prev => ({ ...prev, hasUpdate: false }));
  };

  return {
    ...pwaState,
    installApp,
    updateApp,
    clearUpdateFlag,
  };
}; 