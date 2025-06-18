import { renderHook, act } from '@testing-library/react';
import { usePerformance } from '../usePerformance';

// Mock do Performance API
const mockPerformance = {
  now: jest.fn(),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(),
  getEntriesByName: jest.fn(),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn()
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true
});

describe('usePerformance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformance.now.mockReturnValue(1000);
  });

  it('deve retornar funções de performance', () => {
    const { result } = renderHook(() => usePerformance());
    
    expect(result.current.measureTime).toBeDefined();
    expect(result.current.markStart).toBeDefined();
    expect(result.current.markEnd).toBeDefined();
    expect(result.current.measure).toBeDefined();
  });

  it('deve medir tempo de execução', () => {
    const { result } = renderHook(() => usePerformance());
    
    act(() => {
      const time = result.current.measureTime(() => {
        // Simular trabalho
        return 'resultado';
      });
      expect(time).toBeGreaterThan(0);
    });
  });

  it('deve criar marcas de início e fim', () => {
    const { result } = renderHook(() => usePerformance());
    
    act(() => {
      result.current.markStart('test');
      result.current.markEnd('test');
      
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-start');
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-end');
    });
  });

  it('deve medir entre marcas', () => {
    const { result } = renderHook(() => usePerformance());
    
    act(() => {
      result.current.markStart('test');
      result.current.markEnd('test');
      const measure = result.current.measure('test');
      
      expect(mockPerformance.measure).toHaveBeenCalledWith('test', 'test-start', 'test-end');
    });
  });
}); 