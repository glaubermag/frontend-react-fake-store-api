import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallPromptProps {
  className?: string;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Capturar o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Verificar se o app já está instalado
    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      toast.success('App instalado com sucesso!');
    };

    // Verificar atualizações do service worker
    const handleUpdateFound = () => {
      setShowUpdatePrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verificar se há uma nova versão disponível
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('updatefound', handleUpdateFound);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('updatefound', handleUpdateFound);
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast.success('Instalação iniciada!');
      } else {
        toast.info('Instalação cancelada');
      }
    } catch (error) {
      toast.error('Erro ao instalar o app');
      console.error('Erro na instalação:', error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleUpdateClick = () => {
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

  const handleDismiss = (type: 'install' | 'update') => {
    if (type === 'install') {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    } else {
      setShowUpdatePrompt(false);
    }
  };

  if (!showInstallPrompt && !showUpdatePrompt) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-sm ${className}`}>
      {showInstallPrompt && (
        <Card className="shadow-lg border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-blue-900">Instalar App</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss('install')}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-blue-700">
              Instale nosso app para uma experiência melhor e acesso offline
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isInstalling ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Instalando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Instalar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showUpdatePrompt && (
        <Card className="shadow-lg border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-green-900">Nova Versão</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss('update')}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-green-700">
              Uma nova versão do app está disponível
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button
                onClick={handleUpdateClick}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 