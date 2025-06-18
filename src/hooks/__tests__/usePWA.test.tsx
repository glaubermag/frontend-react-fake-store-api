import React from 'react';
import { renderHook } from '@testing-library/react';
import { usePWA } from '../usePWA';

// Mock do window.navigator
const mockNavigator = {
  serviceWorker: {
    register: jest.fn(),
    ready: Promise.resolve(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getRegistration: jest.fn().mockResolvedValue(null)
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

  it('deve ter métodos de instalação e atualização', () => {
    const { result } = renderHook(() => usePWA());
    
    expect(typeof result.current.installApp).toBe('function');
    expect(typeof result.current.updateApp).toBe('function');
    expect(typeof result.current.clearUpdateFlag).toBe('function');
  });

  it('deve limpar event listeners no unmount', () => {
    const { unmount } = renderHook(() => usePWA());
    
    unmount();
    
    expect(mockWindow.removeEventListener).toHaveBeenCalled();
  });
}); 