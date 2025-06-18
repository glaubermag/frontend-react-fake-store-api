import React from 'react';
import { renderHook } from '@testing-library/react';
import { usePWA } from '../usePWA';

// Mock do window.navigator
const mockNavigator = {
  serviceWorker: {
    register: jest.fn(),
    ready: Promise.resolve(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  },
  onLine: true
};

// Mock do window
const mockWindow = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  matchMedia: jest.fn().mockReturnValue({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  })
};

describe('usePWA', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock do window e navigator
    Object.defineProperty(window, 'navigator', {
      value: mockNavigator,
      writable: true
    });
    
    Object.defineProperty(window, 'addEventListener', {
      value: mockWindow.addEventListener,
      writable: true
    });
    
    Object.defineProperty(window, 'removeEventListener', {
      value: mockWindow.removeEventListener,
      writable: true
    });
    
    Object.defineProperty(window, 'matchMedia', {
      value: mockWindow.matchMedia,
      writable: true
    });
  });

  it('deve retornar estado inicial correto', () => {
    const { result } = renderHook(() => usePWA());
    
    expect(result.current.isOnline).toBe(true);
    expect(result.current.isInstalled).toBe(false);
    expect(result.current.canInstall).toBe(false);
    expect(result.current.deferredPrompt).toBeNull();
  });

  it('deve detectar quando está offline', () => {
    mockNavigator.onLine = false;
    
    const { result } = renderHook(() => usePWA());
    
    expect(result.current.isOnline).toBe(false);
  });

  it('deve detectar quando está online', () => {
    mockNavigator.onLine = true;
    
    const { result } = renderHook(() => usePWA());
    
    expect(result.current.isOnline).toBe(true);
  });

  it('deve detectar quando pode ser instalado', () => {
    // Simular evento beforeinstallprompt
    const mockPrompt = {
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };
    
    const { result } = renderHook(() => usePWA());
    
    // Simular o evento
    const beforeInstallPromptEvent = new Event('beforeinstallprompt');
    Object.defineProperty(beforeInstallPromptEvent, 'prompt', {
      value: mockPrompt.prompt,
      writable: true
    });
    Object.defineProperty(beforeInstallPromptEvent, 'userChoice', {
      value: mockPrompt.userChoice,
      writable: true
    });
    
    // Disparar o evento
    window.dispatchEvent(beforeInstallPromptEvent);
    
    expect(result.current.canInstall).toBe(true);
    expect(result.current.deferredPrompt).toBeTruthy();
  });

  it('deve detectar quando foi instalado', () => {
    const { result } = renderHook(() => usePWA());
    
    // Simular evento appinstalled
    const appInstalledEvent = new Event('appinstalled');
    window.dispatchEvent(appInstalledEvent);
    
    expect(result.current.isInstalled).toBe(true);
  });

  it('deve limpar deferredPrompt após instalação', () => {
    const mockPrompt = {
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };
    
    const { result } = renderHook(() => usePWA());
    
    // Simular beforeinstallprompt
    const beforeInstallPromptEvent = new Event('beforeinstallprompt');
    Object.defineProperty(beforeInstallPromptEvent, 'prompt', {
      value: mockPrompt.prompt,
      writable: true
    });
    Object.defineProperty(beforeInstallPromptEvent, 'userChoice', {
      value: mockPrompt.userChoice,
      writable: true
    });
    
    window.dispatchEvent(beforeInstallPromptEvent);
    
    expect(result.current.deferredPrompt).toBeTruthy();
    
    // Simular appinstalled
    const appInstalledEvent = new Event('appinstalled');
    window.dispatchEvent(appInstalledEvent);
    
    expect(result.current.deferredPrompt).toBeNull();
  });

  it('deve responder a mudanças de conectividade', () => {
    const { result } = renderHook(() => usePWA());
    
    expect(result.current.isOnline).toBe(true);
    
    // Simular desconexão
    mockNavigator.onLine = false;
    const offlineEvent = new Event('offline');
    window.dispatchEvent(offlineEvent);
    
    expect(result.current.isOnline).toBe(false);
    
    // Simular reconexão
    mockNavigator.onLine = true;
    const onlineEvent = new Event('online');
    window.dispatchEvent(onlineEvent);
    
    expect(result.current.isOnline).toBe(true);
  });

  it('deve funcionar em ambiente sem service worker', () => {
    // Simular ambiente sem service worker
    const originalServiceWorker = window.navigator.serviceWorker;
    delete window.navigator.serviceWorker;
    
    const { result } = renderHook(() => usePWA());
    
    expect(result.current.isOnline).toBe(true);
    expect(result.current.isInstalled).toBe(false);
    expect(result.current.canInstall).toBe(false);
    
    // Restaurar service worker
    window.navigator.serviceWorker = originalServiceWorker;
  });

  it('deve ser consistente entre re-renders', () => {
    const { result, rerender } = renderHook(() => usePWA());
    
    const firstResult = result.current;
    rerender();
    const secondResult = result.current;
    
    expect(firstResult.isOnline).toBe(secondResult.isOnline);
    expect(firstResult.isInstalled).toBe(secondResult.isInstalled);
    expect(firstResult.canInstall).toBe(secondResult.canInstall);
  });

  it('deve lidar com múltiplas instâncias do hook', () => {
    const { result: result1 } = renderHook(() => usePWA());
    const { result: result2 } = renderHook(() => usePWA());
    
    expect(result1.current.isOnline).toBe(result2.current.isOnline);
    expect(result1.current.isInstalled).toBe(result2.current.isInstalled);
    expect(result1.current.canInstall).toBe(result2.current.canInstall);
  });

  it('deve ser performático', () => {
    const startTime = performance.now();
    
    const { result } = renderHook(() => usePWA());
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    expect(result.current.isOnline).toBeDefined();
    expect(executionTime).toBeLessThan(10);
  });

  it('deve limpar event listeners no unmount', () => {
    const { unmount } = renderHook(() => usePWA());
    
    unmount();
    
    expect(mockWindow.removeEventListener).toHaveBeenCalled();
  });
}); 