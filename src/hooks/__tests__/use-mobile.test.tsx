import React from 'react';
import { renderHook } from '@testing-library/react';
import { useIsMobile } from '../use-mobile';

// Mock do window.matchMedia
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe('useIsMobile', () => {
  beforeEach(() => {
    // Reset do mock antes de cada teste
    mockMatchMedia(false);
  });

  it('deve retornar false para desktop', () => {
    mockMatchMedia(false);
    
    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(false);
  });

  it('deve retornar true para mobile', () => {
    mockMatchMedia(true);
    
    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(true);
  });

  it('deve responder a mudanças de tamanho de tela', () => {
    mockMatchMedia(false);
    
    const { result, rerender } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(false);
    
    // Simular mudança para mobile
    mockMatchMedia(true);
    rerender();
    
    expect(result.current).toBe(true);
  });

  it('deve funcionar com múltiplas instâncias do hook', () => {
    mockMatchMedia(true);
    
    const { result: result1 } = renderHook(() => useIsMobile());
    const { result: result2 } = renderHook(() => useIsMobile());
    
    expect(result1.current).toBe(true);
    expect(result2.current).toBe(true);
  });

  it('deve lidar com mudanças dinâmicas de viewport', () => {
    mockMatchMedia(false);
    
    const { result, rerender } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(false);
    
    // Simular redimensionamento da janela
    mockMatchMedia(true);
    rerender();
    
    expect(result.current).toBe(true);
    
    // Simular volta para desktop
    mockMatchMedia(false);
    rerender();
    
    expect(result.current).toBe(false);
  });

  it('deve ser consistente entre re-renders', () => {
    mockMatchMedia(true);
    
    const { result, rerender } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(true);
    
    // Re-render sem mudança de estado
    rerender();
    
    expect(result.current).toBe(true);
  });

  it('deve funcionar em ambiente SSR', () => {
    // Simular ambiente sem window
    const originalWindow = global.window;
    delete global.window;
    
    const { result } = renderHook(() => useIsMobile());
    
    // Em SSR, deve retornar false por padrão
    expect(result.current).toBe(false);
    
    // Restaurar window
    global.window = originalWindow;
  });

  it('deve lidar com matchMedia não suportado', () => {
    // Simular navegador sem matchMedia
    const originalMatchMedia = window.matchMedia;
    delete window.matchMedia;
    
    const { result } = renderHook(() => useIsMobile());
    
    // Deve retornar false quando matchMedia não está disponível
    expect(result.current).toBe(false);
    
    // Restaurar matchMedia
    window.matchMedia = originalMatchMedia;
  });

  it('deve ser performático com múltiplas chamadas', () => {
    mockMatchMedia(false);
    
    const startTime = performance.now();
    
    // Múltiplas instâncias do hook
    const { result: result1 } = renderHook(() => useIsMobile());
    const { result: result2 } = renderHook(() => useIsMobile());
    const { result: result3 } = renderHook(() => useIsMobile());
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    expect(result1.current).toBe(false);
    expect(result2.current).toBe(false);
    expect(result3.current).toBe(false);
    
    // Deve executar rapidamente (menos de 10ms)
    expect(executionTime).toBeLessThan(10);
  });

  it('deve manter referência estável entre re-renders', () => {
    mockMatchMedia(true);
    
    const { result, rerender } = renderHook(() => useIsMobile());
    const firstResult = result.current;
    
    rerender();
    const secondResult = result.current;
    
    // O valor deve ser o mesmo, mas a referência pode mudar
    expect(firstResult).toBe(secondResult);
  });
}); 