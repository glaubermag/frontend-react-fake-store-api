import React from 'react';
import { renderHook } from '@testing-library/react';
import { useIsMobile } from '../use-mobile';

// Mock do window.matchMedia e innerWidth
const mockMatchMedia = (matches: boolean, innerWidth: number = 1024) => {
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
  
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    value: innerWidth,
  });
};

describe('useIsMobile', () => {
  beforeEach(() => {
    // Reset do mock antes de cada teste
    mockMatchMedia(false, 1024);
  });

  it('deve retornar false para desktop', () => {
    mockMatchMedia(false, 1024);
    
    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(false);
  });

  it('deve retornar true para mobile', () => {
    mockMatchMedia(true, 375);
    
    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(true);
  });

  it('deve funcionar com múltiplas instâncias do hook', () => {
    mockMatchMedia(true, 375);
    
    const { result: result1 } = renderHook(() => useIsMobile());
    const { result: result2 } = renderHook(() => useIsMobile());
    
    expect(result1.current).toBe(true);
    expect(result2.current).toBe(true);
  });

  it('deve ser consistente entre re-renders', () => {
    mockMatchMedia(true, 375);
    
    const { result, rerender } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(true);
    
    // Re-render sem mudança de estado
    rerender();
    
    expect(result.current).toBe(true);
  });

  it('deve ser performático com múltiplas chamadas', () => {
    mockMatchMedia(false, 1024);
    
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
    mockMatchMedia(true, 375);
    
    const { result, rerender } = renderHook(() => useIsMobile());
    const firstResult = result.current;
    
    rerender();
    const secondResult = result.current;
    
    // O valor deve ser o mesmo, mas a referência pode mudar
    expect(firstResult).toBe(secondResult);
  });
}); 